import ApolloClient from 'apollo-boost';
import { HOST } from '../config';

const Client = new ApolloClient({
  uri: `${HOST}/local_graphql`,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});

export default Client;
