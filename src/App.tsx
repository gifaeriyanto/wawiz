import { ChakraProvider } from '@chakra-ui/react';
import AuthPage from 'pages/auth';
import CreateBroadcastPage from 'pages/create-broadcast';
import DashboardPage from 'pages/dashboard';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import theme from 'theme';
import { RouteSubscribe } from 'utils/auth';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ChakraProvider theme={theme}>
          <HashRouter>
            <RouteSubscribe />
            <Switch>
              <Route path="/auth" component={AuthPage} exact />
              <Route path="/" component={DashboardPage} exact />
              <Route path="/create-broadcast" component={CreateBroadcastPage} />
            </Switch>
          </HashRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
