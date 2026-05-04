import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../../../LudoGame';
import useInput from '../../../hooks/useInput';
import useKeyPress from '../../../hooks/useKeyPress';
import styles from './NameInput.module.css';

const NameInput = ({ isRoomPrivate, roomId }) => {
    const socket = useContext(SocketContext);
    const nickname = useInput('');
    const password = useInput('');
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);

    const handleButtonClick = () => {
        if (!nickname.value) return;
        socket.emit('player:login', { name: nickname.value, password: password.value, roomId: roomId });
    };

    useKeyPress('Enter', handleButtonClick);

    useEffect(() => {
        socket.on('error:wrongPassword', () => {
            setIsPasswordWrong(true);
        });
    }, [socket]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{isRoomPrivate ? 'Join Private Server' : 'Enter Nickname'}</h2>
                <p>Choose a name to represent you in the lobby</p>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Nickname</label>
                <input
                    placeholder='e.g. LudoMaster'
                    type='text'
                    autoFocus
                    className={styles.input}
                    {...nickname}
                />
            </div>

            {isRoomPrivate && (
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Room Password</label>
                    <input
                        placeholder='Enter password'
                        type='password'
                        className={`${styles.input} ${isPasswordWrong ? styles.inputError : ''}`}
                        {...password}
                    />
                    {isPasswordWrong && <span className={styles.errorText}>Incorrect password. Please try again.</span>}
                </div>
            )}

            <button
                className={styles.joinButton}
                onClick={handleButtonClick}
                disabled={!nickname.value}
            >
                JOIN GAME
            </button>
        </div>
    );
};

export default NameInput;
