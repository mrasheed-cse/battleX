import React from 'react';
import PropTypes from 'prop-types';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';
import styles from './NameContainer.module.css';

const NameContainer = ({ player, time }) => {
    return (
        <div
            className={`${styles.container} ${player.nowMoving ? 'movingPulse' : ''}`}
            style={{ backgroundColor: player.ready ? player.color : 'rgba(255, 255, 255, 0.1)' }}
        >
            <div className={styles.nameBadge}>
                {player.nowMoving && <span className={styles.turnIndicator}>TURN</span>}
                <p className={styles.playerName}>{player.name}</p>
            </div>
            {player.nowMoving ? <AnimatedOverlay time={time} /> : null}
        </div>
    );
};

NameContainer.propTypes = {
    player: PropTypes.object,
    time: PropTypes.number,
    testId: PropTypes.string,
};

export default NameContainer;
