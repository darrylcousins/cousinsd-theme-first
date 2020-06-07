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
  }, [visible, content])

  const closeModal = (e) => {
    e.preventDefault();
    setIsVisible(false);
    onClose();
    return true;
  };

  return (
    <div className={isVisible ? 'modal is-visible' : 'modal'}>
      <div className="modal-dialog">
        <section className="modal-content">
          <button
            plain
            onClick={closeModal}
            className="close-modal"
            aria-label="close modal"
            data-close
          >
          ✕  
          </button>
          <p className="modal-text">{ content }</p>
        </section>
      </div>
    </div>
  );
}

