import {
  Box,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import {
  contactsAtom,
  contactsAtomNotSelected,
  contactsAtomSelected,
} from 'atoms/contacts';
import { uniqBy } from 'lodash';
import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroller';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { numberFormat } from 'utils/numberFormat';

export interface RecipientsProps {
  onNext: (page: number, query?: string) => void;
  onEnter: () => void;
  hasMore: boolean;
}

const CheckboxDefaultProps = {
  size: 'lg',
  colorScheme: 'green',
  w: '100%',
  py: 3,
  sx: {
    '.chakra-checkbox__label': {
      w: '100%',
      ml: 4,
    },
    '.chakra-checkbox__control[data-focus]': {
      boxShadow: 'none !important',
    },
  },
};

const Recipients: React.FC<RecipientsProps> = ({
  onNext,
  onEnter,
  hasMore,
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useRecoilState(contactsAtom);
  const setContactsSelected = useSetRecoilState(contactsAtomSelected);
  const contactsNotSelected = useRecoilValue(contactsAtomNotSelected);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter();
      setContacts([]);
    }
  };

  const handleCheckOne = (id: string) => {
    checkedItems.push(id);
    setCheckedItems([...checkedItems]);

    const index = contacts.findIndex((contact) => contact.id === id);
    setContactsSelected((data) => [...data, contacts[index]]);
  };

  const listItems = uniqBy(contactsNotSelected, 'id').map((contact) => (
    <Box borderTop="1px solid" borderColor="gray.200" w="100%" key={contact.id}>
      <Checkbox
        onChange={() => handleCheckOne(contact.id)}
        value={contact.id}
        {...CheckboxDefaultProps}
      >
        {contact.name ? (
          <Flex justify="space-between" align="center">
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
      </Checkbox>
    </Box>
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
            _focus={{ boxShadow: 'none' }}
          />
        </InputGroup>
      </Box>
      <Box overflowY="auto" maxH="calc(100vh - 310px)">
        <InfiniteScroll
          pageStart={0}
          loadMore={(page) => onNext(page, searchQuery)}
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
          {listItems}
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default Recipients;
