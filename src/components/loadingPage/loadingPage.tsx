import { Box, CircularProgress, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import logo from 'static/images/logo.svg';

const LoadingPage: React.FC = () => {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Box textAlign="center">
        <Image src={logo} alt="Logo Wawiz" mb={10} />
        <CircularProgress isIndeterminate color="green.400" />
      </Box>
    </Flex>
  );
};

export default LoadingPage;
