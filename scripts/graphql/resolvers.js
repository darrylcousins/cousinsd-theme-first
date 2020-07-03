import { gql } from '@apollo/client';

export const typeDefs = gql`

  extend type Product {
    isAddOn: Boolean!
  }

  # the initial values taken from the current session cart or XXX later, the
  # subscribers preferences
  type Initial {
    delivered: String
    including: [Product]
    addons: [Product]
    dislikes: [Product]
    shopify_title: String
    shopify_id: Int
    subscribed: Boolean
    total_price: Float
  }

  # the data held and updated by the app
  type Current {
    box: Box
    delivered: String
    including: [Product]
    addons: [Product]
    dislikes: [Product]
  }

  extend type Query {
    getInitial: Initial!
    getCacheBox: Box! # merge the getBox from host??
    getCurrentBox: Current!
  }

`;

export const resolvers = {};
