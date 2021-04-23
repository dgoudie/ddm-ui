import { Header, Sticky } from '@primer/components';
import {
    Link,
    Redirect,
    Route,
    BrowserRouter as Router,
} from 'react-router-dom';
import React, { useContext, useEffect, useMemo } from 'react';

import AuthButton from './components/auth-button/AuthButton';
import BeerOrLiquor from './views/beer-or-liquor/BeerOrLiquor';
import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';
import Login from './views/login/Login';
import Logout from './views/logout/Logout';
import MixedDrink from './views/mixed-drink/MixedDrink';
import MixedDrinks from './views/mixed-drinks/MixedDrinks';
import styles from './App.module.scss';
import toast from 'react-hot-toast';
import { useFetchFromApi } from './utils/fetch-from-api';
import { useTheme } from '@primer/components';

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
                        component={BeersAndLiquors}
                    />
                    <Route
                        path='/beer-or-liquor'
                        exact
                        component={BeerOrLiquor}
                    />
                    <Route path='/mixed-drinks' exact component={MixedDrinks} />
                    <Route path='/mixed-drink' exact component={MixedDrink} />
                    <Route path='/login' exact component={Login} />
                    <Route path='/logout' exact component={Logout} />
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
