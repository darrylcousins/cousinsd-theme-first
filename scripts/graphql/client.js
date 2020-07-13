import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HOST } from '../config';
import { typeDefs } from './resolvers';
import { GET_INITIAL, GET_CURRENT_SELECTION } from './local-queries';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
  /*
  cacheRedirects: {
    Query: {
      Product: (_, args, { getCacheKey }) => {
        return getCacheKey({ __typename: 'Product', id: args.id });
      },
      Box: (_, args, { getCacheKey }) => {
        return getCacheKey({ __typename: 'Box', id: args.id });
      },
      Initial: (_, args, { getCacheKey }) => {
        console.log('initial', args);
        //return args.ids.map(id => getCacheKey({ __typename: 'Product', id: id }));
        return getCacheKey({ __typename: 'Initial', id: args.id });
      }
    },
  },
  */
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
  cache,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  },
  resolvers,
  typeDefs,
});

const initial = {
  box_id: 0,
  delivered: '',
  including: [],
  addons: [],
  dislikes: [],
  shopify_title: '',
  shopify_id: 0,
  subscription: false,
  total_price: 0,
  quantities: [],
  is_loaded: false, // flag if loaded from cart or subscription
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
  subscription: false,
}

Client.writeQuery({
  query: GET_CURRENT_SELECTION,
  data: {
    current,
  }
});

