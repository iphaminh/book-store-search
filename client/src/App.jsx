import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Setup Apollo Client
const uri = '/graphql';
const cache = new InMemoryCache();

const client = new ApolloClient({
  uri,
  cache,
  headers: {
    authorization: `Bearer ${localStorage.getItem('id_token')}` || '',
  },
  
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;