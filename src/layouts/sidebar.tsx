import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { broadcastListState } from 'atoms/sidebar';
import { waStateFormatted } from 'atoms/waState';
import BroadcastList from 'components/broadcastList';
import { BroadcastListData } from 'interfaces/broadcast';
import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { useRecoilState, useRecoilValue } from 'recoil';

const data: BroadcastListData[] = [];

const Sidebar: React.FC = () => {
  const [broadcastListActiveId, setBroadcastListActiveId] = useRecoilState(
    broadcastListState,
  );
  const waStatus = useRecoilValue(waStateFormatted);
  const [searchQuery, setSearchQuery] = useState('');
  const filterRegex = new RegExp(searchQuery, 'gi');

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
            {waStatus}
          </Text>
        </Box>
      </Flex>

      {data.length ? (
        <Box>
          <InputGroup>
            <InputLeftElement
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
            />
          </InputGroup>
        </Box>
      ) : null}

      <Box
        overflowY="auto"
        maxH={`calc(100vh - ${data.length ? 144 : 96}px)`}
        h="100vh"
      >
        {data.length ? (
          data
            .filter((item) => item.title.match(filterRegex))
            .map((item, index) => (
              <BroadcastList
                title={item.title}
                sentCount={item.sentCount}
                image={item.image}
                key={index}
                isActive={index === broadcastListActiveId}
                onClick={() => {
                  setBroadcastListActiveId(index);
                }}
              />
            ))
        ) : (
          <Flex
            fontSize="sm"
            justify="center"
            align="center"
            direction="column"
            color="gray.500"
            p={8}
            h="100%"
          >
            <Text mb={4}>Your broadcast list is empty</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
