import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Button = ({ className, text, icon, size, color, onClick, disabled }) => {
  let content;
  if (text) {
    content = text;
  } else if (icon) {
    content = <FontAwesomeIcon icon={icon} size={size} color={color} />;
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};

export default Button;
