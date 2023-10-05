import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Timer = ({ time }) => {
  const minute = parseInt(time / 60);
  const second =
    parseInt(time % 60) < 10 ? "0" + parseInt(time % 60) : parseInt(time % 60);
  return (
    <>
      <p className="timer">
        <FontAwesomeIcon icon={faClock} size="lg" spin /> {minute}:{second}
      </p>
    </>
  );
};

export default Timer;
