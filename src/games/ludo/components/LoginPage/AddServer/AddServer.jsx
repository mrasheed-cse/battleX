import React, { useState, useContext } from 'react';
import Switch from '@mui/material/Switch';
import { SocketContext } from '../../../LudoGame';
import WindowLayout from '../WindowLayout/WindowLayout';
import useInput from '../../../hooks/useInput';
import styles from './AddServer.module.css';

const AddServer = () => {
    const socket = useContext(SocketContext);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const serverName = useInput('');
    const password = useInput('');

    const handleButtonClick = e => {
        e.preventDefault();
        if (!serverName.value) {
            setIsIncorrect(true);
            return;
        }

        socket.emit('room:create', {
            name: serverName.value,
            password: password.value,
            private: isPrivate,
        });
    };

    return (
        <WindowLayout
            title='Host A Server'
            content={
                <form className={styles.formContainer} onSubmit={handleButtonClick}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Server Room Name</label>
                        <input
                            className={`${styles.mainInput} ${isIncorrect ? styles.inputError : ''}`}
                            type='text'
                            placeholder='e.g. Pro Players Only'
                            {...serverName}
                        />
                        {isIncorrect && <span className={styles.errorText}>Server name is required.</span>}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.privateToggle}>
                            <label className={styles.label}>Private Lobby</label>
                            <div className={styles.toggleWrapper}>
                                <span className={styles.toggleText}>{isPrivate ? 'ON' : 'OFF'}</span>
                                <Switch
                                    checked={isPrivate}
                                    color='primary'
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                            </div>
                        </div>

                        {isPrivate && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Room Password</label>
                                <input
                                    className={styles.passInput}
                                    type='password'
                                    placeholder='••••••'
                                    {...password}
                                />
                            </div>
                        )}
                    </div>

                    <button className={styles.hostBtn} type="submit">CREATE SERVER</button>
                    <p className={styles.footerNote}>Hosting will create a lobby for 4 players.</p>
                </form>
            }
        />
    );
};

export default AddServer;
