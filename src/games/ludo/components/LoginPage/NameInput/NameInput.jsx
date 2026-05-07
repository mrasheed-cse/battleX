import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../../../LudoGame';
import useKeyPress from '../../../hooks/useKeyPress';
import styles from './NameInput.module.css';

const NameInput = ({ isRoomPrivate, roomId }) => {
    const socket = useContext(SocketContext);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);

    // Auto-fill username for logged-in BattleX users
    const loggedInUser = localStorage.getItem('username') || localStorage.getItem('bx_username') || null;
    const isLoggedIn = Boolean(loggedInUser);

    useEffect(() => {
        if (loggedInUser) setNickname(loggedInUser);
    }, [loggedInUser]);

    const handleButtonClick = () => {
        if (!nickname) return;
        const battlexToken = localStorage.getItem('bx_token') || localStorage.getItem('token') || null;
        socket.emit('player:login', {
            name: nickname,
            password: password,
            roomId: roomId,
            battlexToken,
        });
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
                <p>{isLoggedIn ? 'Playing as your BattleX account' : 'Choose a name to represent you in the lobby'}</p>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    Nickname {isLoggedIn && <span style={{fontSize:'11px',color:'#4ade80',marginLeft:6}}>● Signed In</span>}
                </label>
                <input
                    placeholder='e.g. LudoMaster'
                    type='text'
                    autoFocus={!isLoggedIn}
                    readOnly={isLoggedIn}
                    value={nickname}
                    onChange={e => { if (!isLoggedIn) setNickname(e.target.value); }}
                    className={styles.input}
                    style={isLoggedIn ? { opacity: 0.75, cursor: 'not-allowed' } : {}}
                />
            </div>

            {isRoomPrivate && (
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Room Password</label>
                    <input
                        placeholder='Enter password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`${styles.input} ${isPasswordWrong ? styles.inputError : ''}`}
                    />
                    {isPasswordWrong && <span className={styles.errorText}>Incorrect password. Please try again.</span>}
                </div>
            )}

            <button
                className={styles.joinButton}
                onClick={handleButtonClick}
                disabled={!nickname}
            >
                JOIN GAME
            </button>
        </div>
    );
};

export default NameInput;
