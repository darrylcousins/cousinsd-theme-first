import React from 'react';
import {
  Card,
  TextContainer,
  SkeletonBodyText,
  Spinner,
} from '@shopify/polaris';

const spinnerStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
}

export const LoadingTextMarkup = ({ lines }) => (
  <div style={{ position: 'relative' }}>
    <Card sectioned>
      <TextContainer>
        <SkeletonBodyText lines={lines} />
      </TextContainer>
    </Card>
    <div style={spinnerStyle}>
      <Spinner />
    </div>
  </div>
);

const Bleh = ({ lines }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'inline-block' }}>
      <Card sectioned>
        <TextContainer>
          <SkeletonBodyText lines={lines} />
        </TextContainer>
      </Card>
    </div>
    <div style={{ display: 'inline-block' }}>
      <Spinner />
    </div>
  </div>
);
