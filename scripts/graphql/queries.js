import { gql } from '@apollo/client';

export const FRAGMENT_PRODUCT_ARRAY = gql`
  fragment productArray on Box {
    products {
      id
      title
      available
      shopify_gid
      shopify_id
      shopify_handle
      shopify_variant_id
      shopify_price
      __typename
    }
}`;

export const FRAGMENT_ADDONS_ARRAY = gql`
  fragment addOnProductArray on Box {
    addOnProducts {
      id
      title
      available
      shopify_gid
      shopify_id
      shopify_handle
      shopify_variant_id
      shopify_price
      __typename
    }
}`;

export const GET_BOX= gql`
  query getBox($input: BoxIdInput!) {
    getBox(input: $input) {
      ...productArray
      ...addOnProductArray
    }
  }
  ${FRAGMENT_PRODUCT_ARRAY}
  ${FRAGMENT_ADDONS_ARRAY}
`;

export const GET_BOXES = gql`
  query getBoxesByShopifyId($input: BoxShopifyIdInput!) {
    getBoxesByShopifyId(input: $input) {
      id
      title
      delivered
      shopify_gid
      shopify_id
      shopify_handle
      shopify_title
      shopify_price
      ...productArray
      ...addOnProductArray
    }
  }
  ${FRAGMENT_PRODUCT_ARRAY}
  ${FRAGMENT_ADDONS_ARRAY}
`;
