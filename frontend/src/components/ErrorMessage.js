import React from "react";

const ErrorMessage = ({ message }) => (
  message ? <p className="error-text">{message}</p> : null
);

export default ErrorMessage;
