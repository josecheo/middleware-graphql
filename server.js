const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const resolvers = require('./src/resolvers/resolvers');
const PORT = process.env.PORT || 4000;
const typeDefs = fs.readFileSync(path.join(__dirname, './src/schemas/schema.gql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  PORT
});

server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL listo en ${url}`);
});
