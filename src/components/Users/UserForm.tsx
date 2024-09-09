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
  role_name: string;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  role_name,
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
      city_name: '',
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
        city_name: '',
        email: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: User) => {
    onSubmit(data);
    toast({
      title: initialData ? `${role_name} updated.` : `${role_name} created.`,
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
          {initialData ? `Edit ${role_name}` : `Add ${role_name}`}
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
                placeholder={`Enter ${role_name.toLowerCase()} first name`}
              />
            </FormControl>

            <FormControl id='last_name' isRequired mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                {...register('last_name', {
                  required: 'Last Name is required',
                })}
                isInvalid={!!errors.last_name}
                placeholder={`Enter ${role_name.toLowerCase()} last name`}
              />
            </FormControl>

            <FormControl id='phone' isRequired mb={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                type='text'
                {...register('phone_number', { required: 'Phone is required' })}
                isInvalid={!!errors.phone_number}
                placeholder={`Enter ${role_name.toLowerCase()} phone`}
              />
            </FormControl>

            <FormControl id='city' isRequired mb={4}>
              <FormLabel>City</FormLabel>
              <Input
                type='text'
                {...register('city_name', { required: 'City is required' })}
                isInvalid={!!errors.city_name}
                placeholder={`Enter ${role_name.toLowerCase()} city`}
              />
            </FormControl>

            <FormControl id='email' isRequired mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type='email'
                {...register('email', { required: 'Email is required' })}
                isInvalid={!!errors.email}
                placeholder={`Enter ${role_name.toLowerCase()} email`}
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
