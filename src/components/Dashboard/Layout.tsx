import { Box, Flex, VStack, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex minH="100vh">
      <VStack as="nav" bg="gray.800" color="white" w="200px" p={4} spacing={4}>
        <Link as={NavLink} to="/clients">Clients</Link>
        <Link as={NavLink} to="/helpers">Helpers</Link>
        <Link as={NavLink} to="/matching">Matching</Link>
      </VStack>
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
