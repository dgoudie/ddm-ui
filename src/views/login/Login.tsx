import React, { FormEvent, useContext, useEffect, useRef } from 'react';

import { Redirect } from 'react-router';
import { TokenContext } from '../../App';
import styles from './Login.module.scss';

export default function Login() {
    const [redirectToHome, setRedirectToHome] = React.useState(false);
    const { token, setToken } = useContext(TokenContext);
    const isInitialRender = useRef(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    const formSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputRef.current?.value);
        setToken('test');
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
        <form className={styles.root} onSubmit={formSubmit}>
            <div className={styles.inputWrapper}>
                <input
                    placeholder='Password...'
                    type='password'
                    ref={inputRef}
                    autoFocus
                    /* @ts-ignore */
                    onChange={({ target }) => setButtonDisabled(!target.value)}
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
    );
}
