import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { PlayerDataContext, SocketContext } from '../../../LudoGame';

import mapImage from '../../../images/map.jpg';
import positionMapCoords from '../positions';
import pawnImages from '../../../constants/pawnImages';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

// Safe positions on the shared track where pawns cannot be captured
const SAFE_POSITIONS = [16, 21, 29, 34, 42, 47, 55, 60];

// Offset patterns for stacked pawns at the same position
const STACK_OFFSETS = [
    { dx: -8, dy: -8 },
    { dx: 8, dy: -8 },
    { dx: -8, dy: 8 },
    { dx: 8, dy: 8 },
];

const Map = ({ pawns, nowMoving, rolledNumber }) => {
    const player = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);
    const [hintPawn, setHintPawn] = useState();

    // Cache images to prevent flickering
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const cache = useRef({
        map: null,
        pawns: {}
    });

    useEffect(() => {
        let loadedCount = 0;
        const totalImages = 1 + Object.keys(pawnImages).length;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setImagesLoaded(true);
            }
        };

        const boardImg = new Image();
        boardImg.src = mapImage;
        boardImg.onload = onImageLoad;
        cache.current.map = boardImg;

        Object.entries(pawnImages).forEach(([color, src]) => {
            const img = new Image();
            img.src = src;
            img.onload = onImageLoad;
            cache.current.pawns[color] = img;
        });
    }, []);

    // Group pawns by position for stacking offsets
    const getStackOffset = (pawn, allPawns) => {
        const samePosGroup = allPawns.filter(p => p.position === pawn.position);
        if (samePosGroup.length <= 1) return { dx: 0, dy: 0 };
        const idx = samePosGroup.findIndex(p => p._id === pawn._id);
        return STACK_OFFSETS[idx] || { dx: 0, dy: 0 };
    };

    const drawPawn = (context, pawn, allPawns, isHint = false) => {
        const baseCoords = positionMapCoords[pawn.position];
        if (!baseCoords) return null;

        const offset = isHint ? { dx: 0, dy: 0 } : getStackOffset(pawn, allPawns);
        const x = baseCoords.x + offset.dx;
        const y = baseCoords.y + offset.dy;

        const touchableArea = new Path2D();
        touchableArea.arc(x, y, 14, 0, 2 * Math.PI);

        const image = cache.current.pawns[pawn.color];
        if (!image) return touchableArea;

        context.save();

        // Draw a subtle shadow under the pawn
        if (!isHint) {
            context.globalAlpha = 0.2;
            context.beginPath();
            context.ellipse(x, y + 12, 12, 6, 0, 0, 2 * Math.PI);
            context.fillStyle = '#000';
            context.fill();
        }

        // Draw the pawn image
        context.globalAlpha = isHint ? 0.5 : 1.0;
        context.drawImage(image, x - 17, y - 15, 35, 30);

        // Draw a glow ring around movable pawns (current player's turn)
        if (!isHint && nowMoving && rolledNumber && pawn.color === player.color && canPawnMove(pawn, rolledNumber)) {
            context.beginPath();
            context.arc(x, y, 16, 0, 2 * Math.PI);
            context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            context.lineWidth = 2.5;
            context.shadowColor = 'white';
            context.shadowBlur = 10;
            context.stroke();
        }

        context.restore();
        return touchableArea;
    };

    const drawSafeMarkers = (context) => {
        SAFE_POSITIONS.forEach(pos => {
            const coords = positionMapCoords[pos];
            if (!coords) return;
            context.save();
            context.translate(coords.x, coords.y);

            // Draw a star/diamond shape with a glow
            context.beginPath();
            const size = 6;
            context.moveTo(0, -size);
            context.lineTo(size, 0);
            context.lineTo(0, size);
            context.lineTo(-size, 0);
            context.closePath();

            context.shadowColor = 'gold';
            context.shadowBlur = 8;
            context.fillStyle = 'rgba(255, 215, 0, 0.9)';
            context.fill();

            context.restore();
        });
    };

    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded) return;
        const ctx = canvas.getContext('2d');

        // Clear and draw board
        ctx.drawImage(cache.current.map, 0, 0);

        // Draw safe markers
        drawSafeMarkers(ctx);

        // Draw all pawns
        pawns.forEach((pawn, index) => {
            pawns[index].touchableArea = drawPawn(ctx, pawn, pawns);
        });

        // Draw hint ghost
        if (hintPawn) {
            drawPawn(ctx, hintPawn, [], true);
        }
    };

    useEffect(() => {
        render();
    }, [imagesLoaded, pawns, hintPawn, nowMoving, rolledNumber]);

    const handleCanvasClick = event => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const cursorX = (event.clientX - rect.left) * (canvas.width / rect.width);
        const cursorY = (event.clientY - rect.top) * (canvas.height / rect.height);

        for (const pawn of pawns) {
            if (pawn.touchableArea && ctx.isPointInPath(pawn.touchableArea, cursorX, cursorY)) {
                if (canPawnMove(pawn, rolledNumber)) {
                    socket.emit('game:move', pawn._id);
                    break;
                }
            }
        }
        setHintPawn(null);
    };

    const handleMouseMove = event => {
        if (!nowMoving || !rolledNumber) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);

        canvas.style.cursor = 'default';
        for (const pawn of pawns) {
            if (
                pawn.touchableArea &&
                ctx.isPointInPath(pawn.touchableArea, x, y) &&
                player.color === pawn.color &&
                canPawnMove(pawn, rolledNumber)
            ) {
                const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
                if (pawnPosition) {
                    canvas.style.cursor = 'pointer';
                    setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
                    return;
                }
            }
        }
        setHintPawn(null);
    };

    return (
        <canvas
            className='canvas-container'
            width={460}
            height={460}
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
        />
    );
};
export default Map;
