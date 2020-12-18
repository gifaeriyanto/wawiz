import { Alert, AlertIcon, Box, Flex, Image, Link } from '@chakra-ui/react';
import { waQrCode, waStateFormatted } from 'atoms/waState';
import Blocker from 'components/blocker';
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
