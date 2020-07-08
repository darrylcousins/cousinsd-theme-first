import React, { useEffect, useState } from 'react';
import './modal.css';

export const Modal = ({ visible, content, onClose }) => {

  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
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
