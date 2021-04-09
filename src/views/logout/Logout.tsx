import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';

import { LoggedInStatusContext } from '../../App';
import { fetchFromApi } from '../../utils/fetch-from-api';
import styles from './Logout.module.scss';
import toast from 'react-hot-toast';

function Logout({ location }: RouteComponentProps) {
    const [redirectToHome, setRedirectToHome] = React.useState(false);
    const { loggedIn, logout } = useContext(LoggedInStatusContext);
    const isInitialRender = useRef(true);

    const referrer = new URLSearchParams(location.search).get('referrer');

    const handleButtonClick = async () => {
        try {
            await fetchFromApi(`/logout`);
            logout();
        } catch (e) {
            toast.error('An error occurred.');
        }
    };

    useEffect(() => {
        if (!isInitialRender.current) {
            setRedirectToHome(true);
        } else {
            isInitialRender.current = false;
        }
    }, [loggedIn]);
    if (redirectToHome) {
        return <Redirect to={referrer ?? '/'} />;
    }
    return (
        <div className={styles.root}>
            <button className='standard-button' onClick={handleButtonClick}>
                Logout
            </button>
        </div>
    );
}

export default withRouter(Logout);
