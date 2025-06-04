import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
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
  useToast,
  VStack,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import {
  AddIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaces, pages } from '../services/api';

const Workspace = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [pageList, setPageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ title: '' });
  const [editingPage, setEditingPage] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchWorkspaceData = async () => {
    try {
      const [workspaceResponse, pagesResponse] = await Promise.all([
        workspaces.getOne(workspaceId),
        pages.getAll(),
      ]);
      setWorkspace(workspaceResponse.data);
      setPageList(pagesResponse.data.filter(page => page.workspaceId === workspaceId));
    } catch (error) {
      toast({
        title: 'Error fetching workspace data',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [workspaceId]);

  const handleCreatePage = async (e) => {
    e.preventDefault();
    try {
      await pages.create({
        ...formData,
        workspaceId,
      });
      toast({
        title: 'Page created',
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchWorkspaceData();
    } catch (error) {
      toast({
        title: 'Error creating page',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleUpdatePage = async (e) => {
    e.preventDefault();
    try {
      await pages.update(editingPage.id, formData);
      toast({
        title: 'Page updated',
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchWorkspaceData();
    } catch (error) {
      toast({
        title: 'Error updating page',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeletePage = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await pages.delete(id);
        toast({
          title: 'Page deleted',
          status: 'success',
          duration: 3000,
        });
        fetchWorkspaceData();
      } catch (error) {
        toast({
          title: 'Error deleting page',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  const openEditModal = (page) => {
    setEditingPage(page);
    setFormData({ title: page.title });
    onOpen();
  };

  const openCreateModal = () => {
    setEditingPage(null);
    setFormData({ title: '' });
    onOpen();
  };

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg">{workspace?.name}</Heading>
          <Text mt={2} color="gray.600">
            {workspace?.description}
          </Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={openCreateModal}
        >
          New Page
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {pageList.map((page) => (
          <Box
            key={page.id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            _hover={{ shadow: 'sm' }}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={4}>
                <Box
                  cursor="pointer"
                  onClick={() => navigate(`/page/${page.id}`)}
                >
                  <Heading size="md">{page.title}</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Last edited {new Date(page.updatedAt).toLocaleDateString()}
                  </Text>
                </Box>
              </HStack>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem
                    icon={<EditIcon />}
                    onClick={() => openEditModal(page)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<StarIcon />}
                    onClick={() => {
                      // Implement favorite functionality
                    }}
                  >
                    Add to Favorites
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    icon={<DeleteIcon />}
                    color="red.500"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Box>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingPage ? 'Edit Page' : 'Create Page'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form
              onSubmit={editingPage ? handleUpdatePage : handleCreatePage}
            >
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Page title"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  {editingPage ? 'Update' : 'Create'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Workspace; 