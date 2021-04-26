import { Header, Sticky } from '@primer/components';
import {
    Link,
    Redirect,
    Route,
    BrowserRouter as Router,
} from 'react-router-dom';
import React, { Suspense, useContext, useEffect, useMemo } from 'react';

import AuthButton from './components/auth-button/AuthButton';
import styles from './App.module.scss';
import toast from 'react-hot-toast';
import { useFetchFromApi } from './utils/fetch-from-api';
import { useTheme } from '@primer/components';

const BeerOrLiquor = React.lazy(
    () => import('./views/beer-or-liquor/BeerOrLiquor')
);
const BeersAndLiquors = React.lazy(
    () => import('./views/beers-and-liquors/BeersAndLiquors')
);
const MixedDrink = React.lazy(() => import('./views/mixed-drink/MixedDrink'));
const MixedDrinks = React.lazy(
    () => import('./views/mixed-drinks/MixedDrinks')
);

const documentThemeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
);

type LoggedInStatusContextType = {
    loggedIn: boolean | null;
    login: () => void;
    logout: () => void;
};

export const LoggedInStatusContext = React.createContext<LoggedInStatusContextType>(
    {
        loggedIn: null,
        login: () => null,
        logout: () => null,
    }
);

function App() {
    const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);
    const login = () => {
        setLoggedIn(true);
        loggedIn === false && toast.success('Logged in successfully.');
    };
    const logout = () => {
        setLoggedIn(false);
        loggedIn === true && toast.success('Logged out successfully.');
    };
    const { theme } = useTheme();

    const backgroundColor = useMemo(() => theme.colors.bg.primary, [theme]);
    const color = useMemo(() => theme.colors.text.primary, [theme]);

    documentThemeColorMeta?.setAttribute('content', backgroundColor);
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = color;

    const style = useMemo(() => ({ backgroundColor }), [backgroundColor]);
    return (
        <LoggedInStatusContext.Provider
            value={{
                loggedIn,
                login,
                logout,
            }}
        >
            <LoggedInChecker />
            <Router>
                <AppHeader />
                <div className={styles.body} style={style}>
                    <Route
                        path='/beers-and-liquors'
                        exact
                        render={() => (
                            <Suspense fallback={<div />}>
                                <BeersAndLiquors />
                            </Suspense>
                        )}
                    />
                    <Route
                        path='/beer-or-liquor'
                        exact
                        render={() => (
                            <Suspense fallback={<div />}>
                                <BeerOrLiquor />
                            </Suspense>
                        )}
                    />
                    <Route
                        path='/mixed-drinks'
                        exact
                        render={() => (
                            <Suspense fallback={<div />}>
                                <MixedDrinks />
                            </Suspense>
                        )}
                    />
                    <Route
                        path='/mixed-drink'
                        exact
                        render={() => (
                            <Suspense fallback={<div />}>
                                <MixedDrink />
                            </Suspense>
                        )}
                    />
                    <Route path='/' exact>
                        <Redirect to='/mixed-drinks' />
                    </Route>
                </div>
            </Router>
        </LoggedInStatusContext.Provider>
    );
}

export default App;

function LoggedInChecker() {
    const { loggedIn, login, logout } = useContext(LoggedInStatusContext);
    const [response, error, loading] = useFetchFromApi<boolean>(
        '/verify-token'
    );
    useEffect(() => {
        if (loading) {
            return;
        }
        if (response?.status === 200 && !loggedIn) {
            login();
        } else {
            logout();
        } // eslint-disable-next-line
    }, [response, error, loading]);
    return null;
}

function AppHeader() {
    const { loggedIn } = useContext(LoggedInStatusContext);
    return (
        <Sticky top={0} zIndex={2}>
            <Header>
                <Header.Item>
                    <Header.Link as='div'>
                        <Link to='/mixed-drinks'>💎 Diamond Drink Menu</Link>
                    </Header.Link>
                </Header.Item>
                <Header.Item full></Header.Item>
                {loggedIn !== null && (
                    <Header.Item>
                        <AuthButton />
                    </Header.Item>
                )}
            </Header>
        </Sticky>
    );
}
