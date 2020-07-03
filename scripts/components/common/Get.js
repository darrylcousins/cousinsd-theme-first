import React, { useEffect, useState, useCallback } from 'react';

export const Get = ({ url, children }) => {

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('fuck', result);
          setResponse(result);
          setLoading(false);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  if (typeof children == 'function') {
    return children({ response, error, loading });
  };
  return { response, error, loading };
};
