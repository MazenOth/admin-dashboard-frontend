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
} from '@chakra-ui/react';
import { getUsers, updateUser, deleteUser, createUser } from '../services/api';
import { User } from '../types';
import UserForm from '../components/Users/UserForm';

interface UserProps {
  roleName: string;
  heading: string;
}

const Users: React.FC<UserProps> = ({ roleName, heading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await getUsers({ roleName: roleName.toLowerCase() })
      .then((response) => {
        setUsers(response.data);
        console.log(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleCreateOrUpdate = async (user: User) => {
    if (editingUser) {
      await updateUser(editingUser.user_id!, user);
    } else {
      user.roleName = roleName.toLowerCase();
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
        Add {roleName}
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
              <Td>{user.City.name}</Td>
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
      <UserForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateOrUpdate}
        initialData={editingUser}
        roleName={roleName}
      />
    </Box>
  );
};

export default Users;
