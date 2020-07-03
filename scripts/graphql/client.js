import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HOST } from '../config';
import { resolvers, typeDefs } from './resolvers';
import { GET_INITIAL, GET_CURRENT_BOX } from './local-queries';

export const Client = new ApolloClient({
  link: new HttpLink({ uri: `${HOST}/local_graphql` }),
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  },
  resolvers,
  typeDefs,
});

const initial = {
  delivered: null,
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscribed: false,
  total_price: 0,
};

Client.writeQuery({
  query: GET_INITIAL,
  data: {
    initial,
  }
});

const current= {
  box: {},
  delivered: '',
  including: [],
  addons: [],
  dislikes: [],
}

Client.writeQuery({
  query: GET_CURRENT_BOX,
  data: {
    current,
  }
});

