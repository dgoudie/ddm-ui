import React, { useContext, useEffect, useRef } from 'react';

import { Redirect } from 'react-router';
import { TokenContext } from '../../App';
import styles from './Logout.module.scss';

export default function Logout() {
    const [redirectToHome, setRedirectToHome] = React.useState(false);
    const { token, setToken } = useContext(TokenContext);
    const isInitialRender = useRef(true);

    const handleButtonClick = () => {
        setToken(null);
    };

    useEffect(() => {
        if (!isInitialRender.current) {
            setRedirectToHome(true);
        } else {
            isInitialRender.current = false;
        }
    }, [token]);
    if (redirectToHome) {
        return <Redirect to='/' />;
    }
    return (
        <div className={styles.root}>
            <button className='standard-button' onClick={handleButtonClick}>
                Logout
            </button>
        </div>
    );
}
