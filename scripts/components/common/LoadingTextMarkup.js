import React from 'react';
import {
  Card,
  TextContainer,
  SkeletonBodyText,
} from '@shopify/polaris';

export const LoadingTextMarkup = ({ lines }) => (
  <Card sectioned>
    <TextContainer>
      <SkeletonBodyText lines={lines} />
    </TextContainer>
  </Card>
);

