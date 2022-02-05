import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { api } from './api/api';
import Comment from './components/Comment';
import { IComment, IUpdatedFields, IUser } from './types';

let savedComments = window.localStorage.getItem('comments');
let savedUser = window.localStorage.getItem('user');

const initCommentState = savedComments ? JSON.parse(savedComments) : [];
const initUserState = savedUser ? JSON.parse(savedUser) : {};

function App() {
  const [comments, setComments] = useState<IComment[]>(initCommentState);
  const [commentContent, setCommentContent] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<IUser>(initUserState);

  const handleChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) =>
    setCommentContent(target.value);

  useEffect(() => {
    window.localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!savedComments) api.comments().then((res) => setComments(res));
    if (!savedUser) api.user().then((res) => setCurrentUser(res));
  }, []);

  const updateComment = (id: number, updatedContent: IUpdatedFields) => {
    setComments((prevState) =>
      prevState.map((comm) =>
        comm.id === id ? { ...comm, ...updatedContent } : comm,
      ),
    );
  };

  const sendComment = (content: string) => {
    const newComment: IComment = {
      id: comments.length,
      score: 0,
      user: currentUser,
      replies: [],
      createdAt: 'Right now',
      content,
    };
    setComments((prevState) => prevState.concat(newComment));
    setCommentContent('');
  };

  return (
    <Box maxW='100%' p={4} minH='100vh' background='teal.200' className='App'>
      <Container maxW='2xl'>
        <VStack spacing={2}>
          {comments?.map((comment) => (
            <Comment
              updateComment={updateComment}
              key={comment.id}
              {...comment}
            />
          ))}
        </VStack>
        <HStack my={4} borderRadius={5} p={4} align='start' background='white'>
          <Avatar size='sm' name={currentUser.username} />
          <Textarea
            value={commentContent}
            onChange={handleChange}
            placeholder='Add a comment...'
          />
          <Button
            onClick={() => sendComment(commentContent)}
            aria-label='send comment'
            colorScheme='purple'>
            SEND
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}

export default App;
