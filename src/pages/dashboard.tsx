import { Box, Flex, Image } from '@chakra-ui/react';
import Layouts from 'layouts';
import React from 'react';
import illustration from 'static/images/launch-wa.svg';

const IndexPage: React.FC = () => {
  return (
    <Layouts>
      <Flex align="center" h="100vh" justify="center">
        <Box textAlign="center">
          <Image src={illustration} alt="Launch WA" mb={8} />
        </Box>
      </Flex>
    </Layouts>
  );
};

export default IndexPage;
