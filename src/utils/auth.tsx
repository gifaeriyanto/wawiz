import LoadingPage from 'components/loadingPage';
import firebase from 'firebase/app';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  Redirect,
  Route,
  RouteProps,
} from 'react-router-dom';
import { auth } from 'utils/firebase';

interface AuthContextState {
  isFetching: boolean;
  user: firebase.User | undefined | null;
  setUser: (user: firebase.User | undefined) => void;
}

export const AuthContext = createContext<AuthContextState>({
  isFetching: true,
  user: undefined,
  setUser: () => undefined,
});

export const ProvideAuth: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | undefined | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  useEffect(() => {
    if (isFetching && user !== null) {
      setIsFetching(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        isFetching,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { user, isFetching } = useContext(AuthContext);

  const render = ({ location }: any) => {
    if (isFetching) {
      return <LoadingPage />;
    }

    if (user) {
      return children;
    }

    return (
      <Redirect
        to={{
          pathname: '/auth',
          state: { from: location },
        }}
      />
    );
  };

  return <Route {...rest} render={render} />;
};

export const PublicRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const history = useHistory();
  const loc = useLocation();
  const { from } = (loc.state as any) || { from: { pathname: '/' } };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (history && user && from) {
      history.replace(from);
    }
  }, [user, history, from]);

  return <Route {...rest} render={() => children} />;
};
