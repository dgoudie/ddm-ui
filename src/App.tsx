import './App.scss';

import { Route, BrowserRouter as Router } from 'react-router-dom';

import BeersAndLiquors from './views/beers-and-liquors/BeersAndLiquors';

function App() {
    return (
        <Router>
            <Route
                path='/beers-and-liquors'
                exact
                component={BeersAndLiquors}
            />
        </Router>
    );
}

export default App;
