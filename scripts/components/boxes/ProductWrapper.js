import styled from 'styled-components';

export const ProductWrapper = styled.div` 
  font-size: 0.95em;
  margin-bottom: 0.25em;
  cursor: pointer;
  text-transform: initial;
  letter-spacing: initial;
  text-align: right;
  cursor: pointer;
  cursor: ${props => (props.removable ? 'pointer' : 'default')};
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  padding: 0 1.5rem;
  background-color: ${props => {
    if (!props.isAddOn && props.removable) return '#f0bab6';
    if (props.isAddOn) return '#ffd940';
    return '#8cd98c';
    }};
  border: 0.2rem solid white;
  border-color: white;
  transition: border-color 0.2s ease;
  border-radius: 2rem;
  line-height: 2rem;
  color: ${props => (props.isAddOn ? '#000033' : '#001a00')};
  font-weight: 400;
`;
//
