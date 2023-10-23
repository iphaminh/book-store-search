// Import necessary libraries and components
import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Define the GraphQL endpoint URI
const uri = '/graphql';

// Initialize the Apollo Client cache
const cache = new InMemoryCache();

// Set up the Apollo Client with the GraphQL endpoint, cache, and authorization headers
const client = new ApolloClient({
  uri, // GraphQL server endpoint
  cache, // Cache for Apollo Client
  headers: {
    // Set the authorization header with the user's token if available
    authorization: `Bearer ${localStorage.getItem('id_token')}` || '',
  },
});

// Define the App component
function App() {
  return (
    // Wrap the application with ApolloProvider to enable Apollo Client functionality
    <ApolloProvider client={client}>
      {/* Display the Navbar component */}
      <Navbar />
      {/* Outlet component acts as a placeholder for child routes to render */}
      <Outlet />
    </ApolloProvider>
  );
}

// Export the App component as the default export
export default App;
