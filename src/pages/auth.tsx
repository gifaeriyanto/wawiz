import {
  useDisclosure,
  useToast,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';
import AuthModal, { AuthFormData } from 'components/authModal';
import firebase from 'firebase/app';
import React, { useState } from 'react';
import illustration from 'static/images/illustration-onboarding.svg';
import logo from 'static/images/logo.svg';
import { auth } from 'utils/firebase';

const AuthPage: React.FC = () => {
  const toast = useToast();
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = (formData: AuthFormData, isLogin?: boolean) => {
    setIsSubmitting(true);
    const { email, password } = formData;

    if (!email && !password) {
      return;
    }

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      if (isLogin) {
        auth
          .signInWithEmailAndPassword(email, password)
          .catch((error) => {
            toast({
              position: 'top',
              title: 'Login failed',
              description: error.message,
              status: 'warning',
              duration: 8000,
              isClosable: true,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        auth
          .createUserWithEmailAndPassword(email, password)
          .catch((error) => {
            toast({
              position: 'top',
              title: 'Sign Up failed',
              description: error.message,
              status: 'warning',
              duration: 8000,
              isClosable: true,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    });
  };

  return (
    <>
      <Flex
        h="100vh"
        align="center"
        bgImage={`url(${illustration})`}
        bgPos="right"
        bgSize="700px"
        bgRepeat="no-repeat"
      >
        <Container maxW="80%">
          <Image src={logo} alt="Logo Wawiz" mb="120px" h="38px" />
          <Heading as="h1" fontSize="5xl" fontWeight={600} mb={3}>
            Welcome to{' '}
            <Text as="span" color="green.500">
              wawiz
            </Text>
          </Heading>
          <Text>Bring whatsapp to the next level</Text>
          <HStack spacing={4} mt="50px">
            <Button variant="outline" onClick={onOpenLogin}>
              Login
            </Button>
            <Button colorScheme="green" onClick={onOpenSignUp}>
              Sign Up
            </Button>
          </HStack>
        </Container>
      </Flex>

      <AuthModal
        isOpen={isOpenLogin}
        onClose={onCloseLogin}
        onSubmit={(formData) => handleAuth(formData, true)}
        isSubmitting={isSubmitting}
        isLogin
      />

      <AuthModal
        isOpen={isOpenSignUp}
        onClose={onCloseSignUp}
        onSubmit={handleAuth}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AuthPage;
