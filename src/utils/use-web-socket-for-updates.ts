import { useEffect, useState } from 'react';

import { WsBroadcastMessage } from '@dgoudie/ddm-types';
import { singletonHook } from 'react-singleton-hook';
import { usePageVisibility } from 'react-page-visibility';
import useWebSocket from 'react-use-websocket';

if (!process.env.REACT_APP_WS) {
    throw new Error(`'process.env.REACT_APP_WS' not populated.`);
}

const useWebSocketSingleton = singletonHook<
    [WsBroadcastMessage | null, boolean]
>([null, false], () => {
    const pageVisible: boolean = usePageVisibility();
    const {
        lastJsonMessage: message,
    }: { lastJsonMessage: WsBroadcastMessage } = useWebSocket(
        process.env.REACT_APP_WS!,
        {
            shouldReconnect: () => true,
        },
        pageVisible
    );
    return [message, pageVisible];
});

export const useWebSocketForUpdates = (path: string) => {
    const [date, setDate] = useState(Date.now());
    const [message, pageVisible] = useWebSocketSingleton();

    // const {type, apiPath, timestamp} = message;

    useEffect(() => {
        if (message?.type === 'UPDATE' && message?.apiPath === path) {
            setDate(message?.timestamp);
        }
    }, [message?.type, message?.apiPath, message?.timestamp, path]);

    useEffect(() => {
        if (pageVisible) {
            setDate(Date.now());
        }
    }, [pageVisible]);
    return date;
};
