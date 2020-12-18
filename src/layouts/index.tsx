import { Alert, AlertIcon, Box, Image, Link as CLink } from '@chakra-ui/react';
import { waQrCode, waState, waStateFormatted } from 'atoms/waState';
import Blocker from 'components/blocker';
import Sidebar from 'layouts/sidebar';
import React, { useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { API } from 'utils/api';

const Layouts: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const waStatus = useRecoilValue(waStateFormatted).toLowerCase();
  const qrCode = useRecoilValue(waQrCode);

  const handleRefreshQrCode = useRecoilCallback(
    ({ set }) => () => {
      if (waStatus !== 'connected') {
        API.get('/qr-code').then(({ data }) => {
          set(waQrCode, data.qrCode);
        });
      } else {
        set(waQrCode, '');
      }
    },
    [waStatus],
  );

  useEffect(() => {
    const intervalID = setInterval(handleRefreshQrCode, 2000);
    return () => clearInterval(intervalID);
  }, [handleRefreshQrCode]);

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

    return null;
  };

  return (
    <>
      <Sidebar />
      <Box pl="300px" bgColor="green.50" minH="100vh">
        {renderBlocker()}
        {children}
      </Box>
    </>
  );
};

export default Layouts;
