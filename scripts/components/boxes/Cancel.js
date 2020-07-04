import React from 'react';
import styled from 'styled-components';

export const Cancel = ({ children }) => {

  const CancelDiv = styled.span` 
    font-size: 1.5em;
    padding-left: 0.5em;
  `;


  return (
    <CancelDiv>
      { children }
    </CancelDiv>
  );
}



