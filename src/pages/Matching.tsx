import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import {
  getUnmatchedClients,
  getPotentialMatches,
  getMatchedUsers,
  assignHelper,
  unassignHelper,
} from '../services/api';
import { User, MatchedUser } from '../types';

const Matching: React.FC = () => {
  const [unmatchedClients, setUnmatchedClients] = useState<User[]>([]);
  const [potentialHelpers, setPotentialHelpers] = useState<User[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Pagination states
  const [clientPage, setClientPage] = useState(1);
  const [helperPage, setHelperPage] = useState(1);
  const [matchedPage, setMatchedPage] = useState(1);
  const limit = 10; // Set the number of items per page

  useEffect(() => {
    fetchUnmatchedClients(clientPage);
  }, [clientPage]);

  useEffect(() => {
    if (selectedClient) {
      fetchPotentialHelpers(selectedClient, helperPage);
    }
  }, [selectedClient, helperPage]);

  useEffect(() => {
    fetchMatchedUsers(matchedPage);
  }, [matchedPage]);

  const fetchUnmatchedClients = async (page: number) => {
    setLoading(true);
    try {
      await getUnmatchedClients({
        page: page,
        size: limit,
      })
        .then((response) => {
          setUnmatchedClients(response.data);
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      toast({
        title: 'Error fetching unmatched clients.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialHelpers = async (clientId: number, page: number) => {
    setLoading(true);
    try {
      await getPotentialMatches(clientId, {
        page: page,
        size: limit,
      })
        .then((response) => {
          setPotentialHelpers(response.data);
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      toast({
        title: 'Error fetching potential matches.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchedUsers = async (page: number) => {
    setLoading(true);
    try {
      await getMatchedUsers({
        page: page,
        size: limit,
      })
        .then((response) => {
          setMatchedUsers(response.data);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      toast({
        title: 'Error fetching matched users.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignHelper = async (helperId: number) => {
    if (!selectedClient) return;

    try {
      await assignHelper({ clientId: selectedClient, helperId: helperId });
      toast({
        title: 'Helper assigned successfully.',
        status: 'success',
        isClosable: true,
      });
      fetchUnmatchedClients(clientPage);
      fetchMatchedUsers(matchedPage);
      setPotentialHelpers([]);
      setSelectedClient(null);
    } catch (error) {
      toast({
        title: 'Error assigning helper.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleUnassignHelper = async (clientId: number, helperId: number) => {
    try {
      await unassignHelper({ clientId: clientId, helperId: helperId });
      toast({
        title: 'Helper unassigned successfully.',
        status: 'success',
        isClosable: true,
      });
      fetchUnmatchedClients(clientPage);
      fetchMatchedUsers(matchedPage);
    } catch (error) {
      toast({
        title: 'Error unassigning helper.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Matching Clients with Helpers</Heading>

      {loading && <Spinner size='xl' />}

      {/* Unmatched Clients Section */}
      <VStack spacing={4} align='start' mb={6}>
        <Text fontWeight='bold'>Select a Client:</Text>
        <Select
          placeholder='Select unassigned client'
          onChange={(e) => {
            const clientId = parseInt(e.target.value, 10);
            setSelectedClient(clientId);
            setHelperPage(1); // Reset helper page when a new client is selected
          }}
        >
          {unmatchedClients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.first_name} - {client.email} - {client.city_name}
            </option>
          ))}
        </Select>

        {/* Pagination Controls for Unmatched Clients */}
        <HStack spacing={4}>
          <Button
            onClick={() => setClientPage((prev) => Math.max(prev - 1, 1))}
            disabled={clientPage === 1}
          >
            Previous
          </Button>
          <Text>Page {clientPage}</Text>
          <Button onClick={() => setClientPage((prev) => prev + 1)}>
            Next
          </Button>
        </HStack>

        {/* Potential Helpers for Selected Client */}
        {potentialHelpers.length > 0 && (
          <VStack spacing={2} align='start'>
            <Text fontWeight='bold'>Potential Helpers:</Text>
            {potentialHelpers.map((helper) => (
              <Button
                key={helper.user_id}
                onClick={() => handleAssignHelper(helper.helper_id!)}
              >
                {helper.first_name} - {helper.email}
              </Button>
            ))}

            {/* Pagination Controls for Potential Helpers */}
            <HStack spacing={4}>
              <Button
                onClick={() => setHelperPage((prev) => Math.max(prev - 1, 1))}
                disabled={helperPage === 1}
              >
                Previous
              </Button>
              <Text>Page {helperPage}</Text>
              <Button onClick={() => setHelperPage((prev) => prev + 1)}>
                Next
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>

      {/* Matched Users Section */}
      <VStack spacing={4} align='start'>
        <Text fontWeight='bold'>Current Matches:</Text>
        {matchedUsers.map((matchedUser) => (
          <Box
            key={matchedUser.matching_id}
            borderWidth='1px'
            p={4}
            borderRadius='md'
            w='100%'
          >
            <Text>
              <strong>Client:</strong> {matchedUser.client_first_name} (
              {matchedUser.city_name})
            </Text>
            <Text>
              <strong>Helper:</strong> {matchedUser.helper_first_name} (
              {matchedUser.city_name})
            </Text>
            <Button
              mt={2}
              colorScheme='red'
              onClick={() =>
                handleUnassignHelper(
                  matchedUser.client_id!,
                  matchedUser.helper_id!
                )
              }
            >
              Unassign Helper
            </Button>
          </Box>
        ))}

        {/* Pagination Controls for Matched Users */}
        <HStack spacing={4}>
          <Button
            onClick={() => setMatchedPage((prev) => Math.max(prev - 1, 1))}
            disabled={matchedPage === 1}
          >
            Previous
          </Button>
          <Text>Page {matchedPage}</Text>
          <Button onClick={() => setMatchedPage((prev) => prev + 1)}>
            Next
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Matching;
