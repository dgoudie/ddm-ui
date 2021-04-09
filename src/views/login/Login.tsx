import React, { FormEvent, useContext, useEffect, useRef } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';

import { LoggedInStatusContext } from '../../App';
import { displayErrorToast } from '../../utils/toast';
import { fetchFromApi } from '../../utils/fetch-from-api';
import styles from './Login.module.scss';
import toast from 'react-hot-toast';

function Login({ location }: RouteComponentProps) {
    const [redirectToHome, setRedirectToHome] = React.useState(false);
    const { loggedIn, login } = useContext(LoggedInStatusContext);
    const isInitialRender = useRef(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    const referrer = new URLSearchParams(location.search).get('referrer');

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputtedPassword = btoa(inputRef.current?.value!);
        try {
            await fetchFromApi<{
                token: string;
                expires: number;
            }>(
                `/login`,
                {},
                {
                    'x-pw': inputtedPassword,
                }
            );
            login();
        } catch (e) {
            if (e.response.status === 422) {
                toast.error('Invalid Password.');
            } else {
                displayErrorToast(e);
            }
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
        <React.Fragment>
            <form className={styles.root} onSubmit={formSubmit}>
                <div className={styles.inputWrapper}>
                    <input
                        placeholder='Password...'
                        type='password'
                        ref={inputRef}
                        autoFocus
                        /* @ts-ignore */
                        onChange={({ target }) =>
                            setButtonDisabled(!target.value)
                        }
                    />
                </div>
                <button
                    className='standard-button'
                    type='submit'
                    disabled={buttonDisabled}
                >
                    Login
                </button>
            </form>
        </React.Fragment>
    );
}

export default withRouter(Login);
