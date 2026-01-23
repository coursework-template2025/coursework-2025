import './Button.css';

export const Button = ({ children, onClick, disabled, variant = 'primary', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

