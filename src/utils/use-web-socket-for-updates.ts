import { useEffect, useState } from 'react';

import { singletonHook } from 'react-singleton-hook';
import useWebSocket from 'react-use-websocket';

if (!process.env.REACT_APP_WS) {
    throw new Error(`'process.env.REACT_APP_WS' not populated.`);
}

type UpdateMessage = {
    type: 'UPDATE';
    apiPath: string;
    timestamp: number;
};

type BroadcastMessage = UpdateMessage;

const useWebSocketSingleton = singletonHook(null, () => {
    const {
        lastJsonMessage: message,
    }: { lastJsonMessage: BroadcastMessage } = useWebSocket(
        process.env.REACT_APP_WS!,
        {
            shouldReconnect: () => true,
        }
    );
    return message ?? {};
});

export const useWebSocketForUpdates = (path: string) => {
    const [date, setDate] = useState(Date.now());
    const message = useWebSocketSingleton();

    // const {type, apiPath, timestamp} = message;

    useEffect(() => {
        if (message?.type === 'UPDATE' && message?.apiPath === path) {
            setDate(message?.timestamp);
        }
    }, [message?.type, message?.apiPath, message?.timestamp, path]);

    return date;
};
