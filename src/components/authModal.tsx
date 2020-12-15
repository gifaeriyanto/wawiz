import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import PasswordInput from 'components/passwordInput';
import React from 'react';
import { useForm } from 'react-hook-form';
import { errorMessages } from 'utils/validationMessages';

export interface AuthFormData {
  email: string;
  password: string;
}

export interface AuthModalProps {
  onSubmit: (formData: AuthFormData) => void;
  isOpen: boolean;
  onClose: () => void;
  isLogin?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({
  onSubmit,
  isOpen,
  onClose,
  isLogin,
}) => {
  const { handleSubmit, errors, register, formState } = useForm();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="4xl" color="green.500" px="32px" pt="32px">
          {isLogin ? 'Login' : 'Sign Up'}
        </ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: 'none' }} />
        <ModalBody px="32px" py="42px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="text"
                  name="email"
                  placeholder="e.g. fulan@gmail.com"
                  ref={register({
                    required: errorMessages({ attr: 'email' }).required,
                    pattern: {
                      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: errorMessages({ attr: 'email' }).email,
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="*****"
                  ref={register({
                    required: errorMessages({ attr: 'password' }).required,
                    minLength: {
                      value: 8,
                      message: errorMessages({ attr: 'password', value: 8 }).gte
                        .numeric,
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
            {isLogin ? (
              <>
                <Button
                  type="submit"
                  colorScheme="green"
                  mt={6}
                  isFullWidth
                  isLoading={formState.isSubmitting}
                >
                  Login
                </Button>
                <Button variant="link" isFullWidth mt={6}>
                  Forgot Password
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                colorScheme="green"
                mt={6}
                isFullWidth
                isLoading={formState.isSubmitting}
              >
                Sign Up
              </Button>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
