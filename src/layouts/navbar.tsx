import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { authState } from 'atoms/auth';
import { waState } from 'atoms/waState';
import React from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { auth } from 'utils/firebase';
import Routes from 'utils/routes';

const Navbar: React.FC = () => {
  const handleLogout = useRecoilCallback(({ reset }) => () => {
    auth.signOut().then(() => {
      reset(waState);
      reset(authState);
    });
  });

  return (
    <Flex p={8} justify="space-between">
      <HStack spacing={2}>
        <Button size="sm" colorScheme="green">
          Create a Broadcast
        </Button>
        <Menu>
          <MenuButton as={Button} variant="ghost" size="sm" fontSize="xl">
            <RiArrowDownSLine />
          </MenuButton>
          <MenuList>
            <MenuItem>Pengaturan Akun</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Navbar;
