import { Box } from '@chakra-ui/react';
import { waState } from 'atoms/waState';
import Sidebar from 'layouts/sidebar';
import React, { useEffect } from 'react';
import { useRecoilCallback } from 'recoil';
import { API } from 'utils/api';
import { auth } from 'utils/firebase';

const Layouts: React.FC = ({ children }) => {
  useEffect(() => {
    API.get(`/start`);
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
    const intervalID = setInterval(handleRefresh, 2000);
    return () => clearInterval(intervalID);
  }, [handleRefresh]);

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
