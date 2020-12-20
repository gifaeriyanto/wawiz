import {
  useInterval,
  useToast,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useContacts } from 'api/contacts';
import { contactsAtom, contactsAtomSelected } from 'atoms/contacts';
import { waState } from 'atoms/waState';
import Recipients from 'components/recipients';
import Layouts from 'layouts';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from 'utils/api';
import { numberFormat } from 'utils/numberFormat';
import { errorMessages } from 'utils/validationMessages';

export interface CreateBroadcastFormData {
  id: string;
  message: string;
  filepath: string;
}

interface BroadcastFormData {
  id: string;
  message: string;
  filepath: string;
}

const CreateBroadcastPage: React.FC = () => {
  const { handleSubmit, errors, register } = useForm();
  const waStatus = useRecoilValue(waState);
  const [contacts, setContacts] = useRecoilState(contactsAtom);
  const [contactsSelected, setContactsSelected] = useRecoilState(
    contactsAtomSelected,
  );
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const { data, isFetching } = useContacts({ page, query: searchQuery });

  // Send interval
  const [isSending, setIsSending] = useState(false);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState<BroadcastFormData | undefined>();

  const handleSearchEnter = (query: string) => {
    setContacts([]);
    setPage(1);
    setSearchQuery(query);
  };

  const removeContactSelected = (id: string) => {
    const index = contactsSelected.findIndex((contact) => contact.id === id);
    const newContacts = [
      ...contactsSelected.slice(0, index),
      ...contactsSelected.slice(index + 1),
    ];
    setContactsSelected(newContacts);
  };

  const handleGetContacts = (_page: number, query?: string) => {
    console.log({ query });
    if (!hasMore) {
      return;
    }
    setPage(page + 1);
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    setHasMore(data.hasMore);
    if (page > 1) {
      setContacts([...contacts, ...data.data]);
    } else {
      setContacts(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (isFetching) {
      setHasMore(false);
    }
  }, [isFetching]);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isSending ? 2000 : null,
  );

  useEffect(() => {
    if (formData && count) {
      API.post('/send-message', {
        id: contactsSelected[count - 1].number,
        message: formData.message,
        filepath: formData.filepath,
      })
        .then((res) => {
          console.log(res);
        })
        .finally(() => {
          if (count >= contactsSelected.length) {
            setCount(0);
            setIsSending(false);
            toast({
              title: 'Success',
              description:
                'Successfully sent messages to all selected contacts',
              status: 'success',
              duration: 8000,
              isClosable: true,
            });
          }
        });
    }
  }, [count]);

  const handleBroadcastSubmit = (broadcastData: BroadcastFormData) => {
    if (broadcastData) {
      setCount(0);
      setFormData(broadcastData);
      setIsSending(true);
    }
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
          <GridItem>
            <form onSubmit={handleSubmit(handleBroadcastSubmit)}>
              <VStack spacing={4}>
                <FormControl id="id" isInvalid={errors.id}>
                  <FormLabel>Add number</FormLabel>
                  <Input
                    isDisabled={isSending}
                    type="text"
                    name="id"
                    placeholder="e.g. 628123456789"
                    autoComplete="id"
                    // ref={register({
                    //   required: errorMessages({ attr: 'number' }).required,
                    // })}
                  />
                  <FormErrorMessage>{errors.id?.message}</FormErrorMessage>

                  {contactsSelected.length ? (
                    <Box mt={3} overflowY="auto" maxH="100px">
                      {contactsSelected.map((contact) => (
                        <Tooltip
                          label={numberFormat(contact.number)}
                          aria-label="contact number"
                          key={contact.id}
                        >
                          <Tag
                            size="sm"
                            borderRadius="md"
                            variant="solid"
                            colorScheme="green"
                            mr={1}
                            mt={1}
                          >
                            <TagLabel>{contact.name}</TagLabel>
                            <TagCloseButton
                              onClick={() => removeContactSelected(contact.id)}
                            />
                          </Tag>
                        </Tooltip>
                      ))}
                    </Box>
                  ) : null}
                </FormControl>

                <FormControl id="message" isInvalid={errors.message}>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    isDisabled={isSending}
                    type="text"
                    name="message"
                    placeholder="Your message, keep it simple!"
                    autoComplete="message"
                    rows={5}
                    ref={register({
                      required: errorMessages({ attr: 'message' }).required,
                    })}
                  />
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>

                <FormControl id="filepath" isInvalid={errors.filepath}>
                  <FormLabel>Image</FormLabel>
                  <Input
                    isDisabled={isSending}
                    type="text"
                    name="filepath"
                    placeholder="Your image url"
                    autoComplete="filepath"
                    ref={register({
                      pattern: {
                        value: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                        message: errorMessages({ attr: 'image' }).url,
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
              <Button
                type="submit"
                colorScheme="green"
                mt={6}
                isFullWidth
                isLoading={isSending}
              >
                Send
              </Button>
            </form>
          </GridItem>
          <GridItem>
            <Heading fontSize="md" mb={2}>
              Recipients
            </Heading>
            {waStatus === 'CONNECTED' && (
              <Recipients
                onNext={handleGetContacts}
                hasMore={isFetching ? false : hasMore}
                onEnter={handleSearchEnter}
              />
            )}
          </GridItem>
        </Grid>
      </Box>
    </Layouts>
  );
};

export default CreateBroadcastPage;
