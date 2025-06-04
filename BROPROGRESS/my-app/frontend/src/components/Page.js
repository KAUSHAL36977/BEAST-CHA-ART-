import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  useToast,
  VStack,
  HStack,
  Textarea,
  Input,
  Select,
} from '@chakra-ui/react';
import {
  AddIcon,
  DeleteIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { pages, blocks } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const BLOCK_TYPES = {
  TEXT: 'Text',
  HEADING1: 'Heading 1',
  HEADING2: 'Heading 2',
  HEADING3: 'Heading 3',
  BULLETED_LIST: 'Bulleted List',
  NUMBERED_LIST: 'Numbered List',
  TO_DO: 'To-do',
  CODE: 'Code',
};

const BlockEditor = ({ block, onUpdate, onDelete }) => {
  const [content, setContent] = useState(block.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(block.id, { ...block, content: newContent });
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'HEADING1':
        return (
          <Heading size="xl" as="h1">
            {block.content}
          </Heading>
        );
      case 'HEADING2':
        return (
          <Heading size="lg" as="h2">
            {block.content}
          </Heading>
        );
      case 'HEADING3':
        return (
          <Heading size="md" as="h3">
            {block.content}
          </Heading>
        );
      case 'BULLETED_LIST':
        return (
          <Box as="ul" pl={4}>
            {block.content.split('\n').map((item, index) => (
              <Box as="li" key={index}>
                {item}
              </Box>
            ))}
          </Box>
        );
      case 'NUMBERED_LIST':
        return (
          <Box as="ol" pl={4}>
            {block.content.split('\n').map((item, index) => (
              <Box as="li" key={index}>
                {item}
              </Box>
            ))}
          </Box>
        );
      case 'TO_DO':
        return (
          <Box>
            {block.content.split('\n').map((item, index) => (
              <HStack key={index} spacing={2}>
                <Box as="input" type="checkbox" />
                <Text>{item}</Text>
              </HStack>
            ))}
          </Box>
        );
      case 'CODE':
        return (
          <Box
            as="pre"
            p={4}
            bg="gray.100"
            borderRadius="md"
            overflowX="auto"
          >
            {block.content}
          </Box>
        );
      default:
        return <Text>{block.content}</Text>;
    }
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      _hover={{ shadow: 'sm' }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Select
          value={block.type}
          onChange={(e) =>
            onUpdate(block.id, { ...block, type: e.target.value })
          }
          size="sm"
          width="auto"
        >
          {Object.entries(BLOCK_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <HStack>
          <IconButton
            icon={<DragHandleIcon />}
            size="sm"
            variant="ghost"
            aria-label="Drag block"
          />
          <IconButton
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onDelete(block.id)}
          />
        </HStack>
      </Flex>

      {isEditing ? (
        <Textarea
          value={content}
          onChange={handleChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
          minH="100px"
        />
      ) : (
        renderBlockContent()
      )}
    </Box>
  );
};

const Page = () => {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [blockList, setBlockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPageData = async () => {
    try {
      const response = await pages.getOne(pageId);
      setPage(response.data);
      setBlockList(response.data.blocks);
    } catch (error) {
      toast({
        title: 'Error fetching page data',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
    socketService.joinPage(pageId);

    socketService.onBlockUpdate((updatedBlock) => {
      setBlockList((prev) =>
        prev.map((block) =>
          block.id === updatedBlock.id ? updatedBlock : block
        )
      );
    });

    return () => {
      socketService.leavePage(pageId);
    };
  }, [pageId]);

  const handleCreateBlock = async () => {
    try {
      const newBlock = await blocks.create({
        type: 'TEXT',
        content: '',
        order: blockList.length,
        pageId,
      });
      setBlockList((prev) => [...prev, newBlock.data]);
    } catch (error) {
      toast({
        title: 'Error creating block',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleUpdateBlock = async (blockId, updatedBlock) => {
    try {
      await blocks.update(blockId, updatedBlock);
      socketService.updateBlock(blockId, updatedBlock);
    } catch (error) {
      toast({
        title: 'Error updating block',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteBlock = async (blockId) => {
    try {
      await blocks.delete(blockId);
      setBlockList((prev) => prev.filter((block) => block.id !== blockId));
    } catch (error) {
      toast({
        title: 'Error deleting block',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg">{page?.title}</Heading>
          <Text mt={2} color="gray.600">
            Last edited by {user?.name}
          </Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleCreateBlock}
        >
          Add Block
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {blockList.map((block) => (
          <BlockEditor
            key={block.id}
            block={block}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
          />
        ))}
      </VStack>
    </Container>
  );
};

export default Page; 