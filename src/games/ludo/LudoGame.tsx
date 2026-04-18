import { useEffect, useState, createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import Gameboard from './components/Gameboard/Gameboard';
import LoginPage from './components/LoginPage/LoginPage';
import './ludo.css';

export const PlayerDataContext = createContext<any>(null);
export const SocketContext = createContext<Socket | undefined>(undefined);

const LUDO_API = 'https://ludoapi.battlex.games';

export function LudoGame() {
    const [playerData, setPlayerData] = useState<any>();
    const [playerSocket, setPlayerSocket] = useState<Socket>();
    const [redirect, setRedirect] = useState<boolean>(false);

    useEffect(() => {
        const socket = io(LUDO_API, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        socket.on('player:data', (data: string | any) => {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            setPlayerData(parsedData);
            if (parsedData.roomId != null) {
                setRedirect(true);
            }
        });

        setPlayerSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    const renderContent = () => {
        if (redirect && playerData) {
            return (
                <PlayerDataContext.Provider value={playerData}>
                    <Gameboard />
                </PlayerDataContext.Provider>
            );
        } else if (playerSocket) {
            return <LoginPage />;
        } else {
            return (
                <div className="ludo-spinner-container">
                    <div className="ludo-spinner" style={{ width: '150px', height: '150px', borderWidth: '8px' }}></div>
                </div>
            );
        }
    };

    return (
        <div className="ludo-root">
            <div className="ludo-root-container">
                <SocketContext.Provider value={playerSocket}>
                    {renderContent()}
                </SocketContext.Provider>
            </div>
        </div>
    );
}
