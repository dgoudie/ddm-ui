import {
    Link,
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    withRouter,
} from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import BeerOrLiquor from './views/beer-or-liquor/BeerOrLiquor';
import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Logout from './views/logout/Logout';
import MixedDrink from './views/mixed-drink/MixedDrink';
import MixedDrinks from './views/mixed-drinks/MixedDrinks';
import styles from './App.module.scss';
import toast from 'react-hot-toast';
import { useFetchFromApi } from './utils/fetch-from-api';
import { useMediaQuery } from 'beautiful-react-hooks';

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
                <ThemeHandler />
                <HeaderWithRouter />
                <div className={styles.body}>
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
                    <Route path='/' exact component={Home} />
                </div>
            </Router>
        </LoggedInStatusContext.Provider>
    );
}

export default App;

function ThemeHandler() {
    const isDark = useMediaQuery('(prefers-color-scheme: dark)');
    if (isDark) {
        documentThemeColorMeta?.setAttribute('content', '#000000');
    } else {
        documentThemeColorMeta?.setAttribute('content', '#FFFFFF');
    }
    return null;
}

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

function Header({ location }: RouteComponentProps) {
    let breadcrumb: string | null = null;

    switch (location.pathname) {
        case '/beers-and-liquors': {
            breadcrumb = 'Beers & Liquors';
            break;
        }
        case '/mixed-drinks': {
            breadcrumb = 'Mixed Drinks';
            break;
        }
        case '/login': {
            breadcrumb = 'Login';
            break;
        }
        case '/logout': {
            breadcrumb = 'Logout';
            break;
        }
    }
    return (
        <LoggedInStatusContext.Consumer>
            {({ loggedIn }) => (
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        <div>
                            <Link className={styles.headerLink} to='/'>
                                💎 Diamond Drink Menu
                            </Link>
                            {!!breadcrumb && (
                                <React.Fragment>
                                    <i className='fas fa-chevron-right' />
                                    {breadcrumb}
                                </React.Fragment>
                            )}
                        </div>
                        {loggedIn !== null && (
                            <Link
                                to={`${
                                    !!loggedIn ? '/logout' : '/login'
                                }?referrer=${location.pathname}`}
                            >
                                <i
                                    className={`fas fa-${
                                        !!loggedIn ? 'lock-open' : 'lock'
                                    }`}
                                />
                            </Link>
                        )}
                    </div>
                </header>
            )}
        </LoggedInStatusContext.Consumer>
    );
}

const HeaderWithRouter = withRouter(Header);
