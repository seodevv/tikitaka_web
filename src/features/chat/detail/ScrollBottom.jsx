import { faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ScrollBottom = ({ scrollRef, onScrollTo, setScrollBottom }) => {
  const onClickOnBottom = () => {
    if (scrollRef.current) {
      onScrollTo("bottom-smooth");
      setScrollBottom(false);
    }
  };
  return (
    <div
      className="scroll-bottom bd-none bd-circle scroll-animation"
      onClick={onClickOnBottom}
    >
      <FontAwesomeIcon icon={faCircleDown} />
    </div>
  );
};

export default ScrollBottom;
