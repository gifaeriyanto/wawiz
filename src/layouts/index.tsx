import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Image,
  Link as CLink,
  Text,
} from '@chakra-ui/react';
import { useQrCode } from 'api/qrCode';
import { authState } from 'atoms/auth';
import { waState, waStateFormatted } from 'atoms/waState';
import Blocker from 'components/blocker';
import Navbar from 'layouts/navbar';
import Sidebar from 'layouts/sidebar';
import React, { useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { API, APIPaths } from 'utils/api';
import { auth } from 'utils/firebase';

const Layouts: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const waStatus = useRecoilValue(waStateFormatted).toLowerCase();
  const { data: qrCode } = useQrCode(waStatus);

  useEffect(() => {
    API.get(APIPaths.startSession).finally(() => {
      setIsReady(true);
    });
  }, []);

  const handleRefresh = useRecoilCallback(
    ({ set }) => () => {
      API.get(APIPaths.connectionState).then(({ data }) => {
        if (data.connectionState) {
          set(waState, data.connectionState);
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

  const handleLogout = useRecoilCallback(({ reset }) => () => {
    auth.signOut().then(() => {
      reset(waState);
      reset(authState);
    });
  });

  const handleUseHere = () => {
    API.get(APIPaths.useHere);
  };

  const renderBlocker = () => {
    if (qrCode) {
      return (
        <Blocker>
          <Box textAlign="center">
            <Image src={qrCode} w="300px" alt="QR Code" mb={8} mx="auto" />
            <Box fontSize="lg" mb={8}>
              Open Whatsapp in your smartphone and scan this QR code to connect!
            </Box>
            <Alert status="warning" borderRadius="md" maxW="300px" mx="auto">
              <AlertIcon />
              Need help?
              <CLink
                ml={2}
                color="red.500"
                href="https://faq.whatsapp.com/general/download-and-installation/how-to-log-in-or-out/?lang=en"
                isExternal
              >
                Follow this steps
              </CLink>
            </Alert>
          </Box>
        </Blocker>
      );
    }

    if (waStatus === 'initializing...') {
      return <Blocker isLoading>Initializing...</Blocker>;
    }

    if (waStatus === 'conflict') {
      return (
        <Blocker>
          <Box>
            <Text maxW="400px" textAlign="center">
              Whatsapp is open on another computer or browser. Click "Use Here"
              to use this app!
            </Text>
            <HStack justify="center" mt={6}>
              <Button onClick={handleLogout}>Logout</Button>
              <Button
                colorScheme="green"
                onClick={handleUseHere}
                isLoading={waStatus !== 'conflict'}
              >
                Use Here
              </Button>
            </HStack>
          </Box>
        </Blocker>
      );
    }

    return null;
  };

  return (
    <>
      <Sidebar />
      <Box pl="300px" bgColor="green.50" minH="100vh">
        <Navbar />
        {renderBlocker()}
        <Box p={8} pt={0}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layouts;
