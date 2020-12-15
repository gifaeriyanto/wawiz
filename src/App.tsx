import { ChakraProvider } from '@chakra-ui/react';
import AuthPage from 'pages/auth';
import DashboardPage from 'pages/dashboard';
import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';
import theme from 'theme';
import { PrivateRoute, ProvideAuth, PublicRoute } from 'utils/auth';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ProvideAuth>
        <HashRouter>
          <Switch>
            <PublicRoute path="/auth">
              <AuthPage />
            </PublicRoute>
            <PrivateRoute path="/" exact>
              <DashboardPage />
            </PrivateRoute>
          </Switch>
        </HashRouter>
      </ProvideAuth>
    </ChakraProvider>
  );
};

export default App;
