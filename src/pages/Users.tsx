import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  useDisclosure,
  Flex,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { getUsers, updateUser, deleteUser, createUser } from '../services/api';
import { User } from '../types';
import UserForm from '../components/Users/UserForm';

interface UserProps {
  role_name: string;
  heading: string;
}

const Users: React.FC<UserProps> = ({ role_name, heading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const size = 5;

  useEffect(() => {
    setPage(1);
  }, [role_name]);

  useEffect(() => {
    fetchUsers();
  }, [page, role_name]);

  const fetchUsers = async () => {
    const role = { role_name: role_name.toLowerCase() };
    const paginationOptions = { page: page, size: size };
    await getUsers(role, paginationOptions)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(
          Math.ceil((response.data.total ? response.data.total : size) / size)
        );

        console.log(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleCreateOrUpdate = async (user: User) => {
    if (editingUser) {
      await updateUser(editingUser.user_id!, user);
    } else {
      user.role_name = role_name.toLowerCase();
      await createUser(user);
    }
    onClose();
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Box>
      <Heading mb={4}>{heading}</Heading>
      <Button
        colorScheme='teal'
        onClick={() => {
          setEditingUser(null);
          onOpen();
        }}
        mb={4}
      >
        Add {role_name}
      </Button>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Phone</Th>
            <Th>City</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.user_id}>
              <Td>{user.first_name}</Td>
              <Td>{user.phone_number}</Td>
              <Td>{user.city_name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Button
                  size='sm'
                  colorScheme='blue'
                  mr={2}
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  size='sm'
                  colorScheme='red'
                  onClick={() => handleDelete(user.user_id!)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Pagination Controls */}
      <Flex mt={4} alignItems='center'>
        <Button
          size='sm'
          onClick={() => handlePageChange(page - 1)}
          isDisabled={page === 1}
        >
          Previous
        </Button>
        <Spacer />
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Spacer />
        <Button
          size='sm'
          onClick={() => handlePageChange(page + 1)}
          isDisabled={page === totalPages}
        >
          Next
        </Button>
      </Flex>
      <UserForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateOrUpdate}
        initialData={editingUser}
        role_name={role_name}
      />
    </Box>
  );
};

export default Users;
