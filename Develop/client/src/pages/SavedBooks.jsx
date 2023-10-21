import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import Auth from '../utils/auth';

import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
// import { useQuery, useMutation } from '@apollo/react-hooks';

const SavedBooks = () => {
  // Fetch user data with a GraphQL query
  const { data, loading } = useQuery(GET_ME); 
  const userData = data?.me || {};
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Function to handle the deletion of a book
  const handleDeleteBook = async (bookId) => {
    // Check if the user is logged in and retrieve the token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use a GraphQL mutation to remove the book
      const { data } = await removeBook({
        variables: { bookId },
      });

      // Upon success, remove the book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Display a loading message if data is not available yet
  if (!userData || loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
