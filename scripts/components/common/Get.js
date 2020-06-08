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
          setResponse(result);
          setLoading(false);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  return children({ response, error, loading });
};
