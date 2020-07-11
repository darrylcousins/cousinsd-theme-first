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
      subscription
      total_price
      quantities
      is_loaded
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
      subscription
    }
  }
`;

export const PRODUCT_FRAGMENT = gql`
  fragment MyProduct on Product {
    quantity
    isAddOn
  }
`;

export const PRODUCT_FULL_FRAGMENT = gql`
  fragment MyFullProduct on Product {
    id
    title
    available
    shopify_gid
    shopify_id
    shopify_handle
    shopify_variant_id
    shopify_price
    quantity
    isAddOn
  }
`;
