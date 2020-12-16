import { Box } from '@chakra-ui/react';
import Sidebar from 'layouts/sidebar';
import React from 'react';

const Layouts: React.FC = ({ children }) => {
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
