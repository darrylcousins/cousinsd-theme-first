import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Callout,
} from '@shopify/polaris';
import './modal.css';

export const Modal = ({ visible, content, onClose }) => {

  const [isVisible, setIsVisible] = useState(visible);
  const [text, setText] = useState(content);

  useEffect(() => {
    setIsVisible(visible);
    setText(content);
  }, [])

  const closeModal = (e) => {
    e.preventDefault();
    setIsVisible(false);
    onClose();
    return false;
  };

  return (
    <div className={isVisible ? 'modal is-visible' : 'modal'}>
      <div className="modal-dialog">
        <section className="modal-content">
          <button
            onClick={closeModal}
            className="close-modal"
            aria-label="close modal"
            data-close
          >
          ✕  
          </button>
          <div className="modal-text">{ content }</div>
        </section>
      </div>
    </div>
  );
}

