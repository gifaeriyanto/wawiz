import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListIcon,
  ListItem,
  Text,
} from '@chakra-ui/react';
import {
  contactsAtom,
  contactsAtomNotSelected,
  contactsAtomSelected,
} from 'atoms/contacts';
import { uniqBy } from 'lodash';
import React, { useState } from 'react';
import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroller';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { numberFormat } from 'utils/numberFormat';

export interface RecipientsProps {
  onNext: (page: number) => void;
  onEnter: (query: string) => void;
  hasMore: boolean;
}

const Recipients: React.FC<RecipientsProps> = ({
  onNext,
  onEnter,
  hasMore,
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const contacts = useRecoilValue(contactsAtom);
  const setContactsSelected = useSetRecoilState(contactsAtomSelected);
  const contactsNotSelected = useRecoilValue(contactsAtomNotSelected);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(searchQuery);
    }
  };

  const handleCheckOne = (id: string) => {
    checkedItems.push(id);
    setCheckedItems([...checkedItems]);

    const index = contacts.findIndex((contact) => contact.id === id);
    setContactsSelected((data) => [...data, contacts[index]]);
  };

  const listItems = uniqBy(contactsNotSelected, 'id').map((contact) => (
    <ListItem
      borderTop="1px solid"
      borderColor="gray.200"
      w="100%"
      d="flex"
      py={2}
      alignItems="center"
      cursor="pointer"
      _hover={
        {
          svg: {
            color: 'white',
            bgColor: 'green.500',
          },
        } as any
      }
      key={contact.id}
      onClick={() => handleCheckOne(contact.id)}
    >
      <ListIcon
        as={RiAddLine}
        color="gray.400"
        bgColor="gray.100"
        w={6}
        h={6}
        mr={4}
        borderRadius="md"
      />
      {contact.name ? (
        <Flex justify="space-between" align="center" w="100%">
          <Text fontSize="md" fontWeight="600">
            {numberFormat(contact.number)}
          </Text>
          <Text fontSize="sm" color="gray.400" ml={4} textAlign="right">
            {contact.name}
          </Text>
        </Flex>
      ) : (
        <Text fontSize="md" fontWeight="600">
          {numberFormat(contact.number)}
        </Text>
      )}
    </ListItem>
  ));

  return (
    <>
      <Box>
        <InputGroup>
          <InputLeftElement
            w="auto"
            pl={0}
            pointerEvents="none"
            children={<RiSearchLine />}
            color="gray.400"
          />
          <Input
            placeholder="Search"
            size="sm"
            borderRadius="none"
            borderX="none"
            borderTop="none"
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleSearchEnter}
            pl="36px"
          />
        </InputGroup>
      </Box>
      <Box overflowY="auto" maxH="calc(100vh - 310px)">
        <InfiniteScroll
          pageStart={0}
          loadMore={onNext}
          hasMore={hasMore}
          loader={
            <Box
              key={0}
              textAlign="center"
              py={4}
              color="gray.400"
              display={hasMore ? 'block' : 'none'}
            >
              Loading ...
            </Box>
          }
          useWindow={false}
          threshold={100}
        >
          <List>{listItems}</List>
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default Recipients;
