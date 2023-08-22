const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const resolvers = require('./src/resolvers/resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, './src/schemas/schema.gql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL listo en ${url}`);
});
