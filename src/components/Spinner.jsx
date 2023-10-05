import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Spinner = ({ className, style, size = "2xl", color = "#fff" }) => {
  return (
    <>
      <div className={className} style={style}>
        <FontAwesomeIcon icon={faSpinner} size={size} color={color} spin />
      </div>
    </>
  );
};

export default Spinner;
