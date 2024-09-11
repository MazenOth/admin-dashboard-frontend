import { VStack, Link, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

interface NavMenuProps {
  onClose?: () => void;
}

const NavMenu = ({ onClose }: NavMenuProps) => {
  return (
    <VStack spacing={4} align='stretch' p={4} as='nav' onClick={onClose}>
      <Text fontSize='lg' fontWeight='bold' mb={4}>
        Admin Dashboard
      </Text>
      <Link
        as={NavLink}
        to='/clients'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.700' }}
      >
        Clients
      </Link>
      <Link
        as={NavLink}
        to='/helpers'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.700' }}
      >
        Helpers
      </Link>
      <Link
        as={NavLink}
        to='/matching'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.700' }}
      >
        Matching
      </Link>
    </VStack>
  );
};

export default NavMenu;
