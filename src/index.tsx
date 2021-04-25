import './index.scss';

import App from './App';
import { CookiesProvider } from 'react-cookie';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@primer/components';
import { Toaster } from 'react-hot-toast';
import reportWebVitals from './reportWebVitals';
import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();

ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <ThemeProvider colorMode='auto'>
                <App />
            </ThemeProvider>
        </CookiesProvider>
        <Toaster position='bottom-center' />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
