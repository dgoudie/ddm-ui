import React, { CSSProperties } from 'react';

import classnames from 'classnames';
import styles from './Loader.module.scss';

interface Props {
    className?: string;
    style?: CSSProperties;
}

export default function Loader({ className, style }: Props) {
    const isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
    return isChrome ? (
        <div
            className={classnames(styles.infinityChrome, className)}
            style={style}
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    ) : (
        <div className={classnames(styles.infinity, className)} style={style}>
            <div>
                <span></span>
            </div>
            <div>
                <span></span>
            </div>
            <div>
                <span></span>
            </div>
        </div>
    );
}
