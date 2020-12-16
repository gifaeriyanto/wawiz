import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

export interface SidebarListItemProps {
  title: string;
  sentCount: number;
  image?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarListItem: React.FC<SidebarListItemProps> = ({
  title,
  sentCount = 0,
  image,
  isActive,
  onClick,
  ...props
}) => {
  return (
    <Box
      pos="relative"
      cursor="pointer"
      onClick={onClick}
      _before={
        isActive
          ? {
              content: '""',
              w: '4px',
              h: '100%',
              bgColor: 'green.500',
              pos: 'absolute',
              left: 0,
              top: 0,
            }
          : undefined
      }
      {...props}
    >
      <Flex
        py={4}
        mx={6}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Box overflow="hidden">
          <Box isTruncated fontSize="sm" fontWeight="600">
            {title}
          </Box>
          <Box fontSize="xs" color="gray.500">
            Sent to {sentCount} contacts
          </Box>
        </Box>
        <Box ml={4}>
          <Box
            w="36px"
            h="36px"
            bgImage={`url(${image})`}
            bgPos="center"
            bgSize="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SidebarListItem;
