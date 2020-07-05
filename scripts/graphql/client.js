import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HOST } from '../config';
import { typeDefs } from './resolvers';
import { GET_INITIAL, GET_CURRENT_SELECTION } from './local-queries';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
});

const resolvers = {
  /*
  Query: {
    getCurrent: (parent, args, context, info) => {
      console.log(context, info);
      return {};
    }
  },
  */
};

export const Client = new ApolloClient({
  link: new HttpLink({ uri: `${HOST}/local_graphql` }),
  cache: cache,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  },
  resolvers,
  typeDefs,
});

const initial = {
  box_id: 0,
  delivered: null,
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscribed: false,
  total_price: 0,
  quantities: [],
};

Client.writeQuery({
  query: GET_INITIAL,
  data: {
    initial,
  }
});

const current = {
  box: {},
  delivered: '',
  including: [],
  addons: [],
  exaddons: [],
  dislikes: [],
}

Client.writeQuery({
  query: GET_CURRENT_SELECTION,
  data: {
    current,
  }
});

