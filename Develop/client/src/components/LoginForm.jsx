// Import necessary libraries and dependencies
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Import the required Apollo hooks and mutation
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

// Import the Auth utility for user authentication
import Auth from '../utils/auth';

// Define the LoginForm component
const LoginForm = () => {
  // Initialize state for user login form data, form validation, and error alert
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Use the LOGIN_USER mutation with Apollo Client
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  // Handle input changes in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission when the user tries to log in
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the form is valid (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Use the loginUser mutation to log in the user and get a token
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      // Log the data received from the server and store the token in Auth
      console.log(data);
      Auth.login(data.login.token);
    } catch (err) {
      // Handle any errors by displaying an error alert
      console.error(err);
      setShowAlert(true);
    }

    // Reset the form data
    setUserFormData({
      email: '',
      password: '',
    });
  };

  // Render the login form with email and password fields
  return (
    <>
      {/* Render the login form */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Display an alert for login errors */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>

        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
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
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

// Export the LoginForm component
export default LoginForm;
