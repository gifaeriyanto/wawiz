import {
  Avatar,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import SidebarListItem from 'components/sidebarListItem';
import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

const Sidebar: React.FC = () => {
  const [activeList, setActiveList] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  return (
    <Box
      w="300px"
      pos="fixed"
      top={0}
      left={0}
      zIndex={1}
      bgColor="white"
      h="100vh"
      borderRight="1px solid"
      borderColor="gray.200"
    >
      <Flex p="24px">
        <Avatar />
        <Box ml={4}>
          <Text fontWeight="bold" fontSize="18px" color="green.500">
            Gifa Eriyanto
          </Text>
          <Text fontSize="14px" color="gray.500">
            Basic
          </Text>
        </Box>
      </Flex>

      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<RiSearchLine />} />
          <Input
            placeholder="Search"
            size="sm"
            borderRadius="none"
            borderX="none"
            borderTop="none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </InputGroup>
      </Box>

      <Box overflowY="auto" maxH="calc(100vh - 144px)">
        {Array(5)
          .fill({
            title: 'Lorem ipsum dor sit amet constectator',
            sentCount: 1022,
            image: 'https://cf.shopee.ph/file/1c27b88a68d6d16cda8a9c9cdd7bfafc',
          })
          .filter((item) => item.title.toLowerCase().match(searchQuery, 'g'))
          .map((item, index) => (
            <SidebarListItem
              title={item.title}
              sentCount={item.sentCount}
              image={item.image}
              key={index}
              isActive={index === activeList}
              onClick={() => {
                setActiveList(index);
              }}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
