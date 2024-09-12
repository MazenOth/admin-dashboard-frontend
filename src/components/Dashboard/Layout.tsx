import { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import NavMenu from './NavMenu';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <Flex minH='100vh' bg='gray.50'>
      {/* Sidebar for large screens and drawer for small screens */}
      <Box
        as='nav'
        bg='gray.800'
        color='white'
        w={{ base: isSidebarVisible ? '250px' : '0', md: '250px' }}
        display={{ base: 'none', md: 'block' }}
        transition='width 0.3s ease'
        overflow='hidden'
        position='fixed'
        h='100vh'
        zIndex='10'
      >
        <NavMenu onClose={onClose} />
      </Box>

      {/* Drawer for mobile view */}
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='xs'
      >
        <DrawerContent bg='gray.800' color='white'>
          <NavMenu onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* Main content area */}
      <Box flex='1' ml={{ base: '0', md: '250px' }} p={6}>
        {/* Toggle button for mobile */}
        <IconButton
          display={{ base: 'block', md: 'none' }}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          aria-label='Open Menu'
          size='lg'
          position='fixed'
          top='1rem'
          right='1rem'
          zIndex='11'
          bg='gray.800'
          color='white'
          _hover={{ bg: 'gray.700' }}
        />
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
