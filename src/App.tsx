import {
    Link,
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    withRouter,
} from 'react-router-dom';
import { useLocalStorage, useMediaQuery } from 'beautiful-react-hooks';

import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Logout from './views/logout/Logout';
import MixedDrinks from './views/mixed-drinks/MixedDrinks';
import React from 'react';
import styles from './App.module.scss';

const documentThemeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
);

type TokenContextType = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const TokenContext = React.createContext<TokenContextType>({
    token: null,
    setToken: () => null,
});

function App() {
    const [token, setToken] = useLocalStorage<string | null>(
        'AUTH_TOKEN',
        null
    );
    return (
        <TokenContext.Provider
            value={{
                token,
                setToken,
            }}
        >
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
        </TokenContext.Provider>
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
        <TokenContext.Consumer>
            {({ token }) => (
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        <span>
                            <Link className={styles.headerLink} to='/'>
                                💎 Diamond Drink Menu
                            </Link>
                            {!!breadcrumb && (
                                <React.Fragment>
                                    <i className='fas fa-chevron-right' />
                                    {breadcrumb}
                                </React.Fragment>
                            )}
                        </span>
                        <Link to={!!token ? '/logout' : '/login'}>
                            <i
                                className={`fas fa-${
                                    !!token ? 'lock-open' : 'lock'
                                }`}
                            />
                        </Link>
                    </div>
                </header>
            )}
        </TokenContext.Consumer>
    );
}

const HeaderWithRouter = withRouter(Header);
