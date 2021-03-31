import React, { useContext, useEffect, useRef } from 'react';

import { LoggedInStatusContext } from '../../App';
import { Redirect } from 'react-router';
import { fetchFromApi } from '../../utils/fetch-from-api';
import styles from './Logout.module.scss';

export default function Logout() {
    const [redirectToHome, setRedirectToHome] = React.useState(false);
    const { loggedIn, logout } = useContext(LoggedInStatusContext);
    const isInitialRender = useRef(true);

    const handleButtonClick = async () => {
        await fetchFromApi(`/logout`);
        logout();
    };

    useEffect(() => {
        if (!isInitialRender.current) {
            setRedirectToHome(true);
        } else {
            isInitialRender.current = false;
        }
    }, [loggedIn]);
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
