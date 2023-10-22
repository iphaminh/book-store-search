import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Configure Apollo Client
const client = new ApolloClient({
  uri: "/graphql", // The URI to the GraphQL server endpoint
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("id_token") ? `Bearer ${localStorage.getItem("id_token")}` : "",
  },
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
