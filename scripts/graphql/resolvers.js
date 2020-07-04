import { gql } from '@apollo/client';

export const typeDefs = gql`

  extend type Product {
    isAddOn: Boolean!
    quantity: Int!
  }

  extend type Qty {
    handle: String!
    quantity: Int!
  }

  # the initial values taken from the current session cart or XXX later, the
  # subscribers preferences
  type Initial {
    box_id: Int
    delivered: String
    including: [Product]
    addons: [Product]
    dislikes: [Product]
    shopify_title: String
    shopify_id: Int
    subscribed: Boolean
    total_price: Float
    quantities: [Qty]
  }

  # the data held and updated by the app
  type Current {
    box: Box
    delivered: String
    including: [Product]
    addons: [Product]
    exaddons: [Product]
    dislikes: [Product]
  }

  extend type Query {
    getInitial: Initial!
    getCurrent: Current!
  }

`;

export const resolvers = {};
