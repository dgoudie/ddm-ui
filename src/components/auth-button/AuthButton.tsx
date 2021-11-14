import {
    Box,
    ButtonPrimary,
    Details,
    Dropdown,
    Grid,
    Relative,
    StyledOcticon,
    TextInput,
    useDetails,
} from '@primer/components';
import {
    FormEvent,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { KeyIcon, SignInIcon, SignOutIcon } from '@primer/octicons-react';

import { LoggedInStatusContext } from '../../App';
import { displayErrorToast } from '../../utils/toast';
import { fetchFromApi } from '../../utils/fetch-from-api';
import styles from './AuthButton.module.scss';
import toast from 'react-hot-toast';

export default function AuthButton() {
    const { loggedIn } = useContext(LoggedInStatusContext);

    const { getDetailsProps, setOpen, open } = useDetails({
        closeOnOutsideClick: true,
    });

    const done = useCallback(() => setOpen(false), [setOpen]);

    return (
        <Relative>
            <Details {...getDetailsProps()} className={styles.details}>
                <summary>
                    <Box m='-12px -24px -12px' px='18px' py='12px'>
                        <i
                            className={`fas fa-${
                                !!loggedIn ? 'lock-open' : 'lock'
                            }`}
                        />
                    </Box>
                </summary>
                <Dropdown.Menu direction='sw' className={styles.menu}>
                    <Box m={3}>
                        {loggedIn ? (
                            <Logout done={done} open={open} />
                        ) : (
                            <Login done={done} open={open} />
                        )}
                    </Box>
                </Dropdown.Menu>
            </Details>
        </Relative>
    );
}

type LoginLogoutProps = {
    done: () => void;
    open: boolean;
};

function Login({ done, open }: LoginLogoutProps) {
    const { login } = useContext(LoggedInStatusContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const formSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fn = async () => {
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
                    done();
                } catch (e: any) {
                    if (e.response.status === 422) {
                        toast.error('Invalid Password.');
                        inputRef.current?.focus();
                    } else {
                        displayErrorToast(e.response?.data ?? e);
                        done();
                    }
                }
            };
            fn();
        },
        [inputRef, login, done]
    );

    const Input = forwardRef<HTMLInputElement>((_props, ref: any) => (
        <TextInput
            ref={ref}
            className={styles.passwordInput}
            type='password'
            autoFocus
            width={200}
            icon={KeyIcon}
            placeholder='Password...'
        />
    ));

    useEffect(() => {
        open ? inputRef.current?.focus() : inputRef.current?.blur();
    }, [open, inputRef]);

    return (
        <form onSubmit={formSubmit}>
            <Grid gridGap={2}>
                <Input ref={inputRef} />
                <ButtonPrimary type='submit'>
                    <StyledOcticon icon={SignInIcon} mr={2} />
                    Login
                </ButtonPrimary>
            </Grid>
        </form>
    );
}

function Logout({ done, open }: LoginLogoutProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const Button = forwardRef<HTMLButtonElement>((_props, ref) => (
        <ButtonPrimary ref={ref}>
            <StyledOcticon icon={SignOutIcon} mr={2} />
            Logout
        </ButtonPrimary>
    ));
    const { logout } = useContext(LoggedInStatusContext);
    const formSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fn = async () => {
                try {
                    await fetchFromApi(`/logout`);
                    logout();
                } catch (e: any) {
                    displayErrorToast(e.response?.data ?? e);
                }
                done();
            };
            fn();
        },
        [logout, done]
    );
    useEffect(() => {
        open && buttonRef.current?.focus();
    }, [buttonRef, open]);
    return (
        <form onSubmit={formSubmit}>
            <Button ref={buttonRef} />
        </form>
    );
}
