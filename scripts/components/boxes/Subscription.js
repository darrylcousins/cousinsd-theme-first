import React, { useEffect, useState } from 'react';
import {
  RadioButton,
} from '@shopify/polaris';
import styled from 'styled-components';

export const Subscription = ({ state, handleChange }) => {

  const [value, setValue] = useState(state);

  useEffect(() => {
    setValue(state);
  }, [state]);

  const SubContainer = styled.div` 
    display: table;
    width: 100%;
    font-size: 1em;
    color: #4d4d4d;
    text-transform: none;
    line-height: 1.6;
    text-align: left;
  `;
  const SubRow = styled.div` 
    display: table-row;
  `;
  const SubCell = styled.div` 
    display: table-cell;
  `;

  return (
    <SubContainer>
      <SubRow>
        <SubCell>
          <RadioButton
            checked={value === 'onetime'}
            id="onetime"
            name="subscription"
            onChange={handleChange}
          />
        </SubCell>
        <SubCell>
          One-time purchase
        </SubCell>
      </SubRow>
      <SubRow>
        <SubCell>
          <RadioButton
            checked={value === 'subscribe'}
            id="subscribe"
            name="subscription"
            onChange={handleChange}
          />
        </SubCell>
        <SubCell>
          Subscribe and deliver weekly
        </SubCell>
      </SubRow>
    </SubContainer>
  );
}

