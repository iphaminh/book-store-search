import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Import Apollo Client's useMutation hook and the ADD_USER mutation
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

// Import the Auth utility for user authentication
import Auth from '../utils/auth';

const SignupForm = () => {
  // Initialize form state
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Use the useMutation hook to call the ADD_USER mutation
  const [addUser, { error }] = useMutation(ADD_USER);

  // State for form validation
  const [validated] = useState(false);

  // State for displaying alert messages
  const [showAlert, setShowAlert] = useState(false);

  // Handle changes in the input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the form is valid according to react-bootstrap's rules
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Use the addUser mutation to register the user
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      console.log(data);

      // Log the user in with the token received from the server
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);

      // Show an alert if there's an error during signup
      setShowAlert(true);
    }

    // Clear the form data after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* The Form component with validation */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Display an alert if there's an error */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        {/* Username input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Password input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Submit button */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
