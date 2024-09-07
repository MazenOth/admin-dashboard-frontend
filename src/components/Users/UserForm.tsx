import { useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  initialData?: User | null;
  roleName: string;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  roleName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: initialData || {
      first_name: '',
      last_name: '',
      phone_number: '',
      City: { name: '' },
      email: '',
    },
  });

  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        first_name: '',
        last_name: '',
        phone_number: '',
        City: { name: '' },
        email: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: User) => {
    onSubmit(data);
    toast({
      title: initialData ? `${roleName} updated.` : `${roleName} created.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData ? `Edit ${roleName}` : `Add ${roleName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id='user-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl id='first_name' isRequired mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                {...register('first_name', {
                  required: 'First Name is required',
                })}
                isInvalid={!!errors.first_name}
                placeholder={`Enter ${roleName.toLowerCase()} first name`}
              />
            </FormControl>

            <FormControl id='last_name' isRequired mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                {...register('last_name', {
                  required: 'Last Name is required',
                })}
                isInvalid={!!errors.last_name}
                placeholder={`Enter ${roleName.toLowerCase()} last name`}
              />
            </FormControl>

            <FormControl id='phone' isRequired mb={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                type='text'
                {...register('phone_number', { required: 'Phone is required' })}
                isInvalid={!!errors.phone_number}
                placeholder={`Enter ${roleName.toLowerCase()} phone`}
              />
            </FormControl>

            <FormControl id='city' isRequired mb={4}>
              <FormLabel>City</FormLabel>
              <Input
                type='text'
                {...register('City.name', { required: 'City is required' })}
                isInvalid={!!errors.City?.name}
                placeholder={`Enter ${roleName.toLowerCase()} city`}
              />
            </FormControl>

            <FormControl id='email' isRequired mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type='email'
                {...register('email', { required: 'Email is required' })}
                isInvalid={!!errors.email}
                placeholder={`Enter ${roleName.toLowerCase()} email`}
              />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' type='submit' form='user-form'>
            {initialData ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
