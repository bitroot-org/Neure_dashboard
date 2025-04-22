import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`custom-button ${variant} ${fullWidth ? 'full-width' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="button-loader"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;