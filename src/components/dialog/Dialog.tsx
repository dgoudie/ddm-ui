import React from 'react';
import styles from './Dialog.module.scss';

interface Props {
    headerText: string;
    onClosed: () => void;
    children: JSX.Element | JSX.Element[];
}

export default function Dialog({ headerText, onClosed, children }: Props) {
    return (
        <div className={styles.dialog}>
            <div className={styles.dialogBackdrop} onClick={onClosed}></div>
            <div className={styles.dialogBody}>
                <header>
                    <h3>{headerText}</h3>
                    <button onClick={onClosed}>
                        <i className='fas fa-times' />
                    </button>
                </header>
                {children}
            </div>
        </div>
    );
}
