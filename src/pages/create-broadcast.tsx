import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import Layouts from 'layouts';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { API } from 'utils/api';
import { errorMessages } from 'utils/validationMessages';

export interface CreateBroadcastFormData {
  id: string;
  message: string;
  filepath: string;
}

const CreateBroadcastPage: React.FC = () => {
  const { handleSubmit, errors, register } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = (formData: CreateBroadcastFormData) => {
    setIsSubmitting(true);
    API.post('/send-message', formData)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Layouts>
      <Box
        bgColor="white"
        p={8}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Grid templateColumns="1fr 1fr" gap={8}>
          <Box>
            <form onSubmit={handleSubmit(handleCreate)}>
              <VStack spacing={4}>
                <FormControl id="id" isInvalid={errors.id}>
                  <FormLabel>Number</FormLabel>
                  <Input
                    isDisabled={isSubmitting}
                    type="text"
                    name="id"
                    placeholder="e.g. 628123456789"
                    autoComplete="id"
                    ref={register({
                      required: errorMessages({ attr: 'id' }).required,
                    })}
                  />
                  <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="message" isInvalid={errors.message}>
                  <FormLabel>Message</FormLabel>
                  <Input
                    isDisabled={isSubmitting}
                    type="text"
                    name="message"
                    placeholder="Your message, keep it simple!"
                    autoComplete="message"
                    ref={register({
                      required: errorMessages({ attr: 'message' }).required,
                    })}
                  />
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
              <Button
                type="submit"
                colorScheme="green"
                mt={6}
                isFullWidth
                isLoading={isSubmitting}
              >
                Send
              </Button>
            </form>
          </Box>
          <Box>
            <Heading fontSize="md">Recipients</Heading>
          </Box>
        </Grid>
      </Box>
    </Layouts>
  );
};

export default CreateBroadcastPage;
