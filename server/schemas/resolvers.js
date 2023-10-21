const { AuthenticationError } = require('apollo-server-express');
// Import the User model
const { User } = require('../models');
// Import the signToken function from the auth utility
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Using context in our query to retrieve the logged-in user without explicit search
        me: async (parent, args, context) => {
            if (context.user) {
                // Find and return user data, excluding version and password fields
                const userData = await User.findOne({ _id: context.user._id }).select(
                    '-_v -password'
                );
                return userData;
            }
            // Throw an error if the user is not logged in
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        // Add a new user and generate a token
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // Log in with email and password, and return a token
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect email');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        // Save a book to the user's savedBooks array
        saveBook: async (parent, { bookData }, context) => {
            // Check if the user is logged in
            if (context.user) {
                // Update the user's savedBooks array with the new book
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }
            // Throw an error if the user is not logged in
            throw new AuthenticationError("You need to be logged in!");
        },

        // Remove a book from the user's savedBooks array
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // Find the user and remove the specified book from savedBooks
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            // Throw an error if the user is not logged in
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;
