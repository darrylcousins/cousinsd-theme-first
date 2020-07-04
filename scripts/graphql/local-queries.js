import { gql } from '@apollo/client';

export const GET_INITIAL = gql`
  query getInitial @client {
    initial {
      box_id
      delivered
      including
      addons
      dislikes
      shopify_title
      shopify_id
      subscribed
      total_price
      quantities
    }
  }
`;

export const GET_CURRENT_SELECTION = gql`
  query getCurrent @client {
    current {
      box
      delivered
      including
      addons
      exaddons
      dislikes
    }
  }
`;
