import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost'
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Configure Apollo Client
const client = new ApolloClient({
  request: (operation) => {
    // Retrieve the user's token from local storage
    const token = localStorage.getItem("id_token");

    // Set the authorization header with the token if available
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql", // The URI to the GraphQL server endpoint
});

function App() {
  return (
    // Wrap the entire application with ApolloProvider to enable Apollo Client functionality for components
    <ApolloProvider client={client}>
      {/* Use Router component for client-side routing */}
      <Router>
        {/* Display the Navbar component on all pages */}
        <Navbar />
        {/* Routes component to define the application's routes */}
        <Routes>
            {/* Route for the SearchBooks page (exact path: '/') */}
            <Route path='/' element={<SearchBooks />} />
            {/* Route for the SavedBooks page (exact path: '/saved') */}
            <Route path='/saved' element={<SavedBooks />} />
            {/* Default route for handling incorrect page URLs */}
            <Route path='*' element={<h1 className='display-2'>Page Not Found!</h1>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
