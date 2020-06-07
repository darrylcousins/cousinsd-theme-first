import React, { useEffect, useState, useCallback } from 'react';
import {
  Badge,
  InlineError,
  Spinner,
} from '@shopify/polaris';
import { numberFormat } from '../../lib';

export const Product = ({ product, isAddOn, onClick }) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`/products/${product.shopify_handle}.js`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) return <InlineError message={error.message}/>;

  if (!isLoaded) return <Spinner size='small' />;

  if (Object.keys(data).length) { // should check map function
    if (isAddOn) {
      const price = numberFormat(data.variants[0].price);
      return (
        <div
          onClick={() => onClick(product, isAddOn)}
          style={{ cursor: 'pointer' }}
        >
          <Badge progress='incomplete'>
            {product.title} {price}
          </Badge>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => onClick(product, isAddOn)}
          style={{ cursor: 'pointer' }}
        >
          <Badge progress='complete' status='success'>
            {product.title} &#x2716;
          </Badge>
        </div>
      );
    }
  } else {
    return null;
  }
}
