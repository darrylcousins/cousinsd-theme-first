import React from 'react';
import {
  Banner,
} from '@shopify/polaris';

export const Error = ({ message }) => (
  <Banner status="critical">{message}</Banner>
);
