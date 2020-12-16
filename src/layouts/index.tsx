import { Box } from '@chakra-ui/react';
import { waState } from 'atoms/waState';
import Sidebar from 'layouts/sidebar';
import React, { useEffect, useState } from 'react';
import { useRecoilCallback } from 'recoil';
import { API } from 'utils/api';

const Layouts: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    API.get(`/start`).finally(() => {
      setIsReady(true);
    });
  }, []);

  const handleRefresh = useRecoilCallback(
    ({ set }) => () => {
      API.get('/').then(({ data }) => {
        if (data.status) {
          set(waState, data.status);
        }
      });
    },
    [],
  );

  useEffect(() => {
    if (isReady) {
      const intervalID = setInterval(handleRefresh, 2000);
      return () => clearInterval(intervalID);
    }
  }, [handleRefresh, isReady]);

  return (
    <>
      <Sidebar />
      <Box pl="300px" bgColor="green.50" minH="100vh">
        {children}
      </Box>
    </>
  );
};

export default Layouts;
