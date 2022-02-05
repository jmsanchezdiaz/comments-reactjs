import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Avatar,
  Box,
  Button,
  Center,
  Fade,
  HStack,
  Icon,
  IconButton,
  Text,
  useDisclosure,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { IComment, IUpdatedFields } from '../../types';

const ReplyIcon: React.FC<any> = (props) => {
  return (
    <Icon {...props}>
      <path
        d='M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z'
        fill='currentColor'
      />
    </Icon>
  );
};

interface props extends IComment {
  updateComment: (id: number, updatedContent: IUpdatedFields) => void;
}

const Comment: React.FC<props> = ({
  updateComment,
  id,
  score,
  content,
  replyingTo = null,
  createdAt,
  replies = [],
  user,
}) => {
  const [isShowingReplies, setIsShowingReplies] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>(content);
  const [commentScore, setCommentScore] = useState<number>(score);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const areReplies = replies.length > 0;

  const handleClick = () => setIsShowingReplies(!isShowingReplies);
  const handleChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) =>
    setCommentContent(target.value);

  const incrementScore = () => {
    setCommentScore((prev) => prev + 1);
    console.log(typeof commentScore);
    updateComment(id, { score: commentScore });
  };
  const decrementScore = () => {
    if (!commentScore) return;
    setCommentScore((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!commentContent) return;

    updateComment(id, { content: commentContent });
    onClose();
  };

  return (
    <Box
      minW='100%'
      padding={2}
      borderRadius={5}
      background='white'
      as='article'>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea value={commentContent} onChange={handleChange} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmit} color='purple.500' variant='ghost'>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HStack align='start' spacing={5} padding={2}>
        <VStack padding={1} background='lightgray' borderRadius={10}>
          <IconButton
            onClick={incrementScore}
            size='xs'
            variant='unstyled'
            aria-label='add score'
            icon={<AddIcon boxSize={2.5} />}
          />
          <Text fontWeight='semibold' color='purple.500' as='span'>
            {commentScore}
          </Text>
          <IconButton
            onClick={decrementScore}
            size='xs'
            variant='unstyled'
            aria-label='remove score'
            icon={<MinusIcon boxSize={2.5} />}
          />
        </VStack>
        <Box mt={4} flex={1}>
          <HStack as='header' align='center' justify='space-between'>
            <HStack align='center'>
              <Avatar size='xs' name={user.username} fontWeight='bold' />
              <Text fontWeight='bold'>{user.username}</Text>
              <Text fontSize='sm' fontWeight='light'>
                {createdAt}
              </Text>
            </HStack>
            <Button
              onClick={onOpen}
              aria-label='reply to comment'
              color='purple.500'
              background='none'
              leftIcon={<ReplyIcon boxSize={6} marginTop={4} />}>
              Reply
            </Button>
          </HStack>
          <Text flex={1} as='p' fontSize='sm' maxW='95%' marginTop={2}>
            <Text as='span' color='purple.500' fontWeight='bold'>
              {replyingTo && `@${replyingTo} `}
            </Text>
            {content}
          </Text>
        </Box>
      </HStack>
      {areReplies && isShowingReplies && (
        <Fade in={isShowingReplies}>
          <Box background='lightgray'>
            <VStack
              borderColor='purple.200'
              borderLeftWidth={4}
              ml={6}
              py={2}
              pl={8}
              mr={2}>
              {replies?.map((reply) => {
                return (
                  <Comment
                    updateComment={updateComment}
                    key={reply.id}
                    {...reply}
                  />
                );
              })}
            </VStack>
          </Box>
        </Fade>
      )}
      {areReplies && (
        <Center>
          <Button
            onClick={handleClick}
            background='none'
            fontWeight='bold'
            color='purple.500'>
            {isShowingReplies ? 'Hide' : 'See'} replies
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default Comment;
