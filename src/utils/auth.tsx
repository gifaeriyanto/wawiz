import { authState } from 'atoms/auth';
import Blocker from 'components/blocker';
import { useEffect } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { auth } from 'utils/firebase';

const PUBLIC_PATH = ['/auth'];

export const RouteSubscribe: React.FC = () => {
  const [authStatus, setAuthStatus] = useRecoilState(authState);
  const history = useHistory();
  const location = useLocation();
  const { from } = (location.state as any) || { from: { pathname: '/' } };

  useEffect(() => {
    auth.onAuthStateChanged((currentState) => {
      if (currentState) {
        setAuthStatus('auth');
      } else {
        setAuthStatus('un-auth');
      }
    });
  }, []);

  switch (authStatus) {
    case 'initializing':
      return <Blocker isLoading>Initializing</Blocker>;

    case 'auth':
      if (PUBLIC_PATH.includes(location.pathname)) {
        history.replace(from);
      }
      return null;

    case 'un-auth':
      if (!PUBLIC_PATH.includes(location.pathname)) {
        return (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: location.pathname },
            }}
          />
        );
      }
      return null;
  }
};
