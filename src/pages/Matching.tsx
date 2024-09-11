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

  const [loadingUnmatched, setLoadingUnmatched] = useState(false);
  const [loadingPotential, setLoadingPotential] = useState(false);
  const [loadingMatched, setLoadingMatched] = useState(false);

  const toast = useToast();

  // Pagination states
  const [clientPage, setClientPage] = useState(1);
  const [helperPage, setHelperPage] = useState(1);
  const [matchedPage, setMatchedPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [totalHelpers, setTotalHelpers] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);
  const size = 5;

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
    setLoadingUnmatched(true);
    try {
      const response = await getUnmatchedClients({
        page: page,
        size: size,
      });
      setUnmatchedClients(response.data.clients);
      setTotalClients(response.data.total || 0);
    } catch (error) {
      toast({
        title: 'Error fetching unmatched clients.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoadingUnmatched(false);
    }
  };

  const fetchPotentialHelpers = async (client_id: number, page: number) => {
    setLoadingPotential(true);
    try {
      const response = await getPotentialMatches(client_id, {
        page: page,
        size: size,
      });
      setPotentialHelpers(response.data.potentialHelpers);
      setTotalHelpers(response.data.total || 0);
    } catch (error) {
      toast({
        title: 'Error fetching potential matches.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoadingPotential(false);
    }
  };

  const fetchMatchedUsers = async (page: number) => {
    setLoadingMatched(true);
    try {
      const response = await getMatchedUsers({
        page: page,
        size: size,
      });
      setMatchedUsers(response.data.matchings);
      setTotalMatched(response.data.total || 0);
    } catch (error) {
      toast({
        title: 'Error fetching matched users.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoadingMatched(false);
    }
  };

  const handleAssignHelper = async (helper_id: number) => {
    if (!selectedClient) return;

    try {
      await assignHelper({ client_id: selectedClient, helper_id: helper_id });
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

  const handleUnassignHelper = async (client_id: number, helper_id: number) => {
    try {
      await unassignHelper({ client_id: client_id, helper_id: helper_id });
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

  const getPageCount = (total: number) => Math.max(1, Math.ceil(total / size));

  return (
    <Box p={4}>
      <Heading mb={6}>Matching Clients with Helpers</Heading>

      {/* Unmatched Clients Section */}
      <VStack spacing={4} align='start' mb={6}>
        <Text fontWeight='bold'>Select a Client:</Text>
        {loadingUnmatched ? (
          <Spinner size='xl' />
        ) : (
          <Select
            placeholder='Select unassigned client'
            onChange={(e) => {
              const client_id = parseInt(e.target.value, 10);
              setSelectedClient(client_id);
              setHelperPage(1);
            }}
          >
            {unmatchedClients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.first_name} - {client.email} - {client.city_name}
              </option>
            ))}
          </Select>
        )}

        {/* Pagination Controls for Unmatched Clients */}
        <HStack spacing={4}>
          <Button
            onClick={() => setClientPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={clientPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {clientPage} of {getPageCount(totalClients)}
          </Text>
          <Button
            onClick={() =>
              setClientPage((prev) =>
                prev < getPageCount(totalClients) ? prev + 1 : prev
              )
            }
            isDisabled={clientPage === getPageCount(totalClients)}
          >
            Next
          </Button>
        </HStack>

        {/* Potential Helpers for Selected Client */}
        {potentialHelpers.length > 0 && (
          <VStack spacing={2} align='start'>
            <Text fontWeight='bold'>Potential Helpers:</Text>
            {loadingPotential ? (
              <Spinner size='xl' />
            ) : (
              potentialHelpers.map((helper) => (
                <Button
                  key={helper.user_id}
                  onClick={() => handleAssignHelper(helper.helper_id!)}
                >
                  {helper.first_name} - {helper.email}
                </Button>
              ))
            )}

            {/* Pagination Controls for Potential Helpers */}
            <HStack spacing={4}>
              <Button
                onClick={() => setHelperPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={helperPage === 1}
              >
                Previous
              </Button>
              <Text>
                Page {helperPage} of {getPageCount(totalHelpers)}
              </Text>
              <Button
                onClick={() =>
                  setHelperPage((prev) =>
                    prev < getPageCount(totalHelpers) ? prev + 1 : prev
                  )
                }
                isDisabled={helperPage === getPageCount(totalHelpers)}
              >
                Next
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>

      {/* Matched Users Section */}
      <VStack spacing={4} align='start'>
        <Text fontWeight='bold'>Current Matches:</Text>
        {loadingMatched ? (
          <Spinner size='xl' />
        ) : (
          matchedUsers.map((matchedUser) => (
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
          ))
        )}

        {/* Pagination Controls for Matched Users */}
        <HStack spacing={4}>
          <Button
            onClick={() => setMatchedPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={matchedPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {matchedPage} of {getPageCount(totalMatched)}
          </Text>
          <Button
            onClick={() =>
              setMatchedPage((prev) =>
                prev < getPageCount(totalMatched) ? prev + 1 : prev
              )
            }
            isDisabled={matchedPage === getPageCount(totalMatched)}
          >
            Next
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Matching;
