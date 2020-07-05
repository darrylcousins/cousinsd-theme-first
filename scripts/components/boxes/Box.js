import React, { useState, useCallback } from 'react';
import { Checkbox } from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { ProductList } from './ProductList';
import { SelectDislikes } from './SelectDislikes';
import { SelectAddons } from './SelectAddons';
import { AddonText } from './AddonText';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Spacer } from '../common/Spacer';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const Box = ({ loaded }) => {

  if (!loaded) return null;
  const [customise, setCustomise] = useState(false);
  const handleChange = useCallback((newChecked) => setCustomise(newChecked), []);

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const current = data.current;
        //console.log('box.js', data);
        const customiseMarkup = (
          <>
            <Spacer />
            <SelectDislikes />
            <ProductList type='dislikes' />
            <AddonText />
            <SelectAddons />
            <ProductList type='exaddons' />
          </>
        );
        return (
          <>
            <ProductList type='including' />
            <label style={{ width: '100%' }}>
              <Checkbox
                checked={customise}
                onChange={handleChange}
              />
              <span>Customise your box</span>
            </label>
            {customise && customiseMarkup}
          </>
        );
      }}
    </Query>
  );
};
