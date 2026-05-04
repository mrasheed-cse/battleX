import lock from '../../../../images/login-page/lock.png';
import styles from './ServersTable.module.css';

const ServerListTable = ({ rooms, handleJoinClick }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.rooms}>
                <thead>
                    <tr>
                        <th className={styles.firstColumn}></th>
                        <th>SERVER NAME</th>
                        <th>PLAYERS</th>
                        <th>STATUS</th>
                        <th className={styles.lastColumn}></th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.length === 0 ? (
                        <tr>
                            <td colSpan="5" className={styles.emptyState}>
                                No active servers found. Host one to start!
                            </td>
                        </tr>
                    ) : (
                        rooms.map((room, index) => {
                            if (room.started) return null;
                            return (
                                <tr key={index} className={styles.roomRow}>
                                    <td className={styles.firstColumn}>
                                        {room.private ? <img src={lock} alt='private' className={styles.lockIcon} /> : null}
                                    </td>
                                    <td className={styles.roomName}>{room.name}</td>
                                    <td>
                                        <div className={styles.playerCount}>
                                            <span className={styles.countText}>{room.players.length}/4</span>
                                            <div className={styles.miniBar}>
                                                <div
                                                    className={styles.miniBarFill}
                                                    style={{ width: `${(room.players.length / 4) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.statusBadge}>
                                            {room.isStarted ? 'ONGOING' : 'WAITING'}
                                        </span>
                                    </td>
                                    <td className={styles.lastColumn}>
                                        <button className={styles.joinBtn} onClick={() => handleJoinClick(room)}>Join</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ServerListTable;
