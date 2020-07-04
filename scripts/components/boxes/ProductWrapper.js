import React from 'react';
import styled from 'styled-components';

export const ProductWrapper = ({ children, isAddOn }) => {

  const ProductDiv = styled.div` 
    font-size: 0.95em;
    margin-bottom: 0.25em;
    cursor: pointer;
    text-transform: initial;
    letter-spacing: initial;
    text-align: right;
    cursor: pointer;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    padding: 0 1.5rem;
    background-color: ${props => (
      props.isAddOn
      ? '#80b6ff'
      : '#8cd98c'
      )};
    border: 0.2rem solid white;
    border-color: white;
    transition: border-color 0.2s ease;
    border-radius: 2rem;
    line-height: 2rem;
    color: ${props => (props.isAddOn ? '#000033' : '#001a00')};
    font-weight: 400;
  `;

  return (
    <ProductDiv isAddOn={isAddOn}>
      { children }
    </ProductDiv>
  );
}


