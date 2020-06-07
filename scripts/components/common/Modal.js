import React from 'react';
import {
  Card,
  Callout,
} from '@shopify/polaris';
import './modal.css';

export const Modal = () => (
  <div className="modal">
    <div className="modal-dialog">
      <section className="modal-content">
        <button className="close-modal" aria-label="close modal" data-close>
        ✕  
        </button>
        <p>
          Some Content
        </p>
      </section>
    </div>
  </div>
);

