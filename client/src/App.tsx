import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { Navbar } from './containers/navbar';
import AppShell from './AppShell';
import { Welcome, FourOFour, Home } from './pages';

// const Home = lazy(() => import('./pages/home'));
// const Search = lazy(() => import('./pages/Search'));
// const Create = lazy(() => import('./pages/Create'));
// const Profile = lazy(() => import('./pages/Profile')); // This will include the Recent, Sets, Folders, Classes
// const Settings = lazy(() => import('./pages/Settings'));
// const Users = lazy(() => import('./pages/Users'));

const LoadingFallback = () => (
    <AppShell>
        <div className='p-4'>Loading...</div>
    </AppShell>
);

const UnauthenticatedRoutes = () => (
    <Switch>
        <Route path='/login'>
            <Welcome authStatus='login' />
        </Route>
        <Route path='/signup'>
            <Welcome authStatus='signUp' />
        </Route>
        <Route exact path='/'>
            <Welcome />
        </Route>
        <Route path='*'>
            <FourOFour />
        </Route>
    </Switch>
);

interface Auth {
    token: null | string;
    expiresAt: null | number;
    userInfo: any;
    isAdmin: boolean;
    isAuthenticated: boolean;
}
interface RootState {
    auth: Auth;
}

const AuthenticatedRoute = ({ children, ...rest }) => {
    const auth = useSelector((state: RootState) => state.auth, shallowEqual);
    console.log(auth);
    return (
        <Route
            {...rest}
            render={() => (auth.isAuthenticated ? <AppShell>{children}</AppShell> : <Redirect to='/' />)}
        ></Route>
    );
};

function App() {
    const auth = useSelector((state: RootState) => state.auth, shallowEqual);
    console.log('here');
    console.log(auth);

    return (
        <>
            <Navbar isAuthenticated={auth.isAuthenticated} />
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Switch>
                        <AuthenticatedRoute path='/home'>
                            <Home />
                        </AuthenticatedRoute>
                        <UnauthenticatedRoutes />
                    </Switch>
                </Suspense>
            </Router>
        </>
    );
}

export default App;

// NOTE: Admin routes will probably exist in the actual site, but will not exist in this clone
