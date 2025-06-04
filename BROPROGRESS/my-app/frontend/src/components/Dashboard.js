import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { workspaces } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [workspaceList, setWorkspaceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchWorkspaces = useCallback(async () => {
    try {
      const response = await workspaces.getAll();
      setWorkspaceList(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching workspaces',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      await workspaces.create(formData);
      toast({
        title: 'Workspace created',
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchWorkspaces();
    } catch (error) {
      toast({
        title: 'Error creating workspace',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    try {
      await workspaces.update(editingWorkspace.id, formData);
      toast({
        title: 'Workspace updated',
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchWorkspaces();
    } catch (error) {
      toast({
        title: 'Error updating workspace',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        await workspaces.delete(id);
        toast({
          title: 'Workspace deleted',
          status: 'success',
          duration: 3000,
        });
        fetchWorkspaces();
      } catch (error) {
        toast({
          title: 'Error deleting workspace',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  const openEditModal = (workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || '',
    });
    onOpen();
  };

  const openCreateModal = () => {
    setEditingWorkspace(null);
    setFormData({ name: '', description: '' });
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={8}>
        <Box>
          <Heading size="lg">Welcome, {user?.name}</Heading>
          <Text mt={2} color="gray.600">
            Your workspaces
          </Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={openCreateModal}
        >
          New Workspace
        </Button>
      </HStack>

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {workspaceList.map((workspace) => (
          <Box
            key={workspace.id}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            _hover={{ shadow: 'md' }}
            cursor="pointer"
            onClick={() => navigate(`/workspace/${workspace.id}`)}
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="md">{workspace.name}</Heading>
              <HStack>
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(workspace);
                  }}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkspace(workspace.id);
                  }}
                />
              </HStack>
            </HStack>
            <Text color="gray.600">{workspace.description}</Text>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingWorkspace ? 'Edit Workspace' : 'Create Workspace'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form
              onSubmit={editingWorkspace ? handleUpdateWorkspace : handleCreateWorkspace}
            >
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Workspace name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Workspace description"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  {editingWorkspace ? 'Update' : 'Create'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard; 