import React, { useContext } from 'react';
import { SocketContext } from '../../../LudoGame';
import images from '../../../constants/diceImages';
import styles from './Dice.module.css';

const Dice = ({ rolledNumber, nowMoving, playerColor, movingPlayer }) => {
    const socket = useContext(SocketContext);

    const handleClick = () => {
        socket.emit('game:roll');
    };

    const isCurrentPlayer = movingPlayer === playerColor;
    const hasRolledNumber = rolledNumber !== null && rolledNumber !== undefined;

    return (
        <div className={`${styles.container} ${isCurrentPlayer && !hasRolledNumber && nowMoving ? styles.activeDice : ''}`}>
            {isCurrentPlayer ? (
                hasRolledNumber ? (
                    <img src={images[rolledNumber - 1]} className={styles.diceImg} alt={rolledNumber} />
                ) : nowMoving ? (
                    <img src={images[6]} className={`${styles.diceImg} roll`} alt='roll' onClick={handleClick} />
                ) : null
            ) : null}
        </div>
    );
};

export default Dice;
