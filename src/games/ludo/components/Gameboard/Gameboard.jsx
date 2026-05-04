import React, { useState, useEffect, useContext } from 'react';
// Custom spinner for React 19 compatibility
import { PlayerDataContext, SocketContext } from '../../LudoGame';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import Overlay from '../Overlay/Overlay';
import styles from './Gameboard.module.css';
import trophyImage from '../../images/trophy.webp';

const Gameboard = () => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);

    const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
    const [time, setTime] = useState();
    const [isReady, setIsReady] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const [movingPlayer, setMovingPlayer] = useState('red');

    const [winner, setWinner] = useState(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    useEffect(() => {
        socket.emit('room:data', context.roomId);
        socket.on('room:data', data => {
            data = JSON.parse(data);
            if (data.players == null) return;
            // Filling navbar with empty player nick container
            while (data.players.length !== 4) {
                data.players.push({ name: '...' });
            }
            // Checks if client is currently moving player by session ID
            const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
            if (nowMovingPlayer) {
                if (nowMovingPlayer._id === context.playerId) {
                    setNowMoving(true);
                } else {
                    setNowMoving(false);
                }
                setMovingPlayer(nowMovingPlayer.color);
            }
            const currentPlayer = data.players.find(player => player._id === context.playerId);
            setIsReady(currentPlayer.ready);
            setRolledNumber(data.rolledNumber);
            setPlayers(data.players);
            setPawns(data.pawns);
            setTime(data.nextMoveTime);
            setStarted(data.started);
        });

        socket.on('game:winner', winner => {
            setWinner(winner);
        });
        socket.on('redirect', () => {
            window.location.reload();
        });

    }, [socket, context.playerId, context.roomId, setRolledNumber]);

    const handleExit = () => {
        socket.emit('player:exit');
    };

    return (
        <>
            {pawns.length === 16 ? (
                <div className='container'>
                    <Navbar
                        players={players}
                        started={started}
                        time={time}
                        isReady={isReady}
                        movingPlayer={movingPlayer}
                        rolledNumber={rolledNumber}
                        nowMoving={nowMoving}
                        ended={winner !== null}
                    />
                    <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />

                    {/* Exit Game Button */}
                    {!winner && (
                        <button
                            className={started ? styles.exitButton : styles.waitingExitButton}
                            onClick={() => setShowExitConfirm(true)}
                            title="Leave Game"
                        >
                            ✕ Leave
                        </button>
                    )}
                </div>
            ) : (
                <div className="ludo-spinner-container">
                    <div className="ludo-spinner" style={{ width: '100px', height: '100px' }}></div>
                </div>
            )}

            {/* Exit Confirmation */}
            {showExitConfirm && (
                <Overlay handleOverlayClose={() => setShowExitConfirm(false)}>
                    <div className={styles.confirmContainer}>
                        <h2>Leave Game?</h2>
                        <p>Are you sure you want to leave this game?</p>
                        <div className={styles.confirmButtons}>
                            <button className={styles.confirmYes} onClick={handleExit}>
                                Yes, Leave
                            </button>
                            <button className={styles.confirmNo} onClick={() => setShowExitConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Overlay>
            )}

            {/* Winner Overlay */}
            {winner ? (
                <Overlay>
                    <div className={styles.winnerContainer}>
                        <img src={trophyImage} alt='winner' />
                        <h1>
                            Winner: <span style={{ color: winner, textTransform: 'capitalize' }}>{winner}</span>
                        </h1>
                        <button onClick={() => socket.emit('player:exit')}>Play again</button>
                    </div>
                </Overlay>
            ) : null}
        </>
    );
};

export default Gameboard;
