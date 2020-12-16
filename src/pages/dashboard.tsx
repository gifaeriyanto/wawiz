import { Alert, AlertIcon, Box, Flex, Image, Link } from '@chakra-ui/react';
import { waQrCode, waStateFormatted } from 'atoms/waState';
import Blocker from 'components/blocker';
import Layouts from 'layouts';
import React, { useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import illustration from 'static/images/launch-wa.svg';
import { API } from 'utils/api';

const IndexPage: React.FC = () => {
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

  return (
    <Layouts>
      <Flex align="center" h="100vh" justify="center">
        <Box textAlign="center">
          {qrCode ? (
            <Blocker>
              <Box textAlign="center">
                <Image src={qrCode} w="300px" alt="QR Code" mb={8} mx="auto" />
                <Box fontSize="lg" mb={8}>
                  Open Whatsapp in your smartphone and scan this QR code to
                  connect!
                </Box>
                <Alert
                  status="warning"
                  borderRadius="md"
                  maxW="300px"
                  mx="auto"
                >
                  <AlertIcon />
                  Need help?
                  <Link
                    ml={2}
                    color="red.500"
                    href="https://faq.whatsapp.com/general/download-and-installation/how-to-log-in-or-out/?lang=en"
                    isExternal
                  >
                    Follow this steps
                  </Link>
                </Alert>
              </Box>
            </Blocker>
          ) : null}
          <Image src={illustration} alt="Launch WA" mb={8} />
        </Box>
      </Flex>
    </Layouts>
  );
};

export default IndexPage;
