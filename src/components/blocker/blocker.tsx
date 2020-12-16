import { Box, CircularProgress, Flex, Image, Text } from '@chakra-ui/react';
import { waStateFormatted } from 'atoms/waState';
import React from 'react';
import { useRecoilValue } from 'recoil';
import logo from 'static/images/logo.svg';

interface BlockerProps {
  isLoading?: boolean;
}

const Blocker: React.FC<BlockerProps> = ({ children, isLoading }) => {
  const waStatus = useRecoilValue(waStateFormatted);

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      zIndex={9999}
      bgColor="white"
    >
      {isLoading ? (
        <Box textAlign="center">
          <Image src={logo} alt="Logo Wawiz" mb={10} />
          <Flex align="center" justify="center">
            <CircularProgress isIndeterminate color="green.400" size="30px" />
            <Text ml={4}>{waStatus}</Text>
          </Flex>
        </Box>
      ) : (
        children
      )}
    </Flex>
  );
};

export default Blocker;
