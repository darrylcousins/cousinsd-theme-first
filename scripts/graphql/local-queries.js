import { gql } from '@apollo/client';

export const GET_INITIAL = gql`
  query getInitial @client {
    initial {
      delivered
      including
      addons
      dislikes
      shopify_title
      shopify_id
      subscribed
      total_price
    }
  }
`;

export const GET_CURRENT_BOX = gql`
  query getCurrentBox @client {
    current {
      box
      delivered
      including
      addons
      dislikes
    }
  }
`;
