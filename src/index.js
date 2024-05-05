const dotenv = require("dotenv");
const { ApolloServer, gql } = require("apollo-server");
const chalk = require("chalk");

// The GraphQL schema
const typeDefs = gql`
    type Query {
        "A simple type for getting started!"
        hello: String
    }
`;

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        hello: () => "world",
    },
};

// Load environment variables from .env file
dotenv.config();

const { red, yellow } = chalk;

// Get the port number from the environment variables, or use 4000 as the default
const port = parseInt(process.env.PORT, 10) || 4000;

let server;

/**
 * Start the Apollo Server.
 */
const startApolloServer = async () => {
    try {
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: () => ({
                // Add chalk to the context
                red,
                yellow,
            }),
        });
        const { url } = await server.listen({ port });
        console.log(`Apollo Server started at ${url} 🚀`);
    } catch (error) {
        handleServerStartError(error);
    }
};

/**
 * Handle errors that occur when starting the Apollo Server.
 * @param {Error} error - The error that occurred.
 */
const handleServerStartError = (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(
            red(`Port ${port} is already in use. Please choose another port.`)
        );
    } else {
        console.error(red(`Error starting Apollo Server: ${error.message}`));
    }
};

/**
 * Shut down the Apollo Server on receiving a shutdown signal.
 */
const gracefulShutdown = () => {
    console.log(
        yellow(
            "\nReceived a shutdown signal. Closing Apollo Server..."
        )
    );
    if (server) {
        server.stop().then(() => {
            console.log("Apollo Server closed. Goodbye! 👋");
            process.exit(0);
        });
    } else {
        console.log("Apollo Server not running. Goodbye! 👋");
        process.exit(0);
    }
};

// Start the Apollo Server
startApolloServer();

// Gracefully handle forced shutdown (Ctrl+C)
process.on("SIGINT", gracefulShutdown);
