import React from 'react';
import ReactDOM from 'react-dom';

const Popup = ({ children, onClose }) => {
    const popupContent = (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: "50%",
                transform: "translate(-50%, 0)",
                background: "lightblue",
                padding: "1rem",
                cursor: "pointer",
                zIndex: 1000, // This ensures the popup appears above all other elements
            }}
        >
            {children}
        </div>
    );

    return ReactDOM.createPortal(popupContent, document.body);
};

export default Popup;
