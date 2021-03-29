import {
    Link,
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    withRouter,
} from 'react-router-dom';

import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';
import Home from './views/home/Home';
import MixedDrinks from './views/mixed-drinks/MixedDrinks';
import React from 'react';
import styles from './App.module.scss';

function App() {
    return (
        <Router>
            <HeaderWithRouter />
            <Route
                path='/beers-and-liquors'
                exact
                component={BeersAndLiquors}
            />
            <Route path='/mixed-drinks' exact component={MixedDrinks} />
            <Route path='/' exact component={Home} />
        </Router>
    );
}

export default App;

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
    }
    return (
        <header className={styles.header}>
            <span>
                <Link to='/'>💎 Diamond Drink Menu 💎</Link>
                {!!breadcrumb && (
                    <React.Fragment>
                        <i className='fas fa-chevron-right' />
                        {breadcrumb}
                    </React.Fragment>
                )}
            </span>
        </header>
    );
}

const HeaderWithRouter = withRouter(Header);
