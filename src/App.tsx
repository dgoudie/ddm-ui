import {
    Link,
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    withRouter,
} from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Logout from './views/logout/Logout';
import MixedDrinks from './views/mixed-drinks/MixedDrinks';
import styles from './App.module.scss';
import { useFetchFromApi } from './utils/fetch-from-api';
import { useMediaQuery } from 'beautiful-react-hooks';

const documentThemeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
);

type LoggedInStatusContextType = {
    loggedIn: boolean;
    login: () => void;
    logout: () => void;
};

export const LoggedInStatusContext = React.createContext<LoggedInStatusContextType>(
    {
        loggedIn: false,
        login: () => null,
        logout: () => null,
    }
);

function App() {
    const [loggedIn, setLoggedIn] = React.useState(false);
    return (
        <LoggedInStatusContext.Provider
            value={{
                loggedIn,
                login: () => setLoggedIn(true),
                logout: () => setLoggedIn(false),
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
                    <Route path='/mixed-drinks' exact component={MixedDrinks} />
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
    const response = useFetchFromApi<boolean>('/verify-token');
    useEffect(() => {
        if (!response) {
            return;
        }
        if (response.status === 200 && !loggedIn) {
            login();
        } else if (response.status === 401 && !!loggedIn) {
            logout();
        } // eslint-disable-next-line
    }, [response]);
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
                        <Link to={!!loggedIn ? '/logout' : '/login'}>
                            <i
                                className={`fas fa-${
                                    !!loggedIn ? 'lock-open' : 'lock'
                                }`}
                            />
                        </Link>
                    </div>
                </header>
            )}
        </LoggedInStatusContext.Consumer>
    );
}

const HeaderWithRouter = withRouter(Header);
