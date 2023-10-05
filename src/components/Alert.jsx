import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeMessage } from "../features/social/socialReducer";

const Alert = ({
  className = "",
  style = {},
  background = "rgb(192, 19, 19)",
  color = "#fff",
  text,
}) => {
  let styles = { ...style, background, color };

  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(closeMessage());
    }, 2000);
  }, []);
  return (
    <div className={`alert ${className}`} style={styles}>
      <span>{text}</span>
    </div>
  );
};

export default Alert;
