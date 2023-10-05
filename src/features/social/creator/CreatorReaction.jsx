import {
  faComment,
  faHeart,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexGrowBox } from "../../../components/Styled";

const CreatorReaction = () => {
  return (
    <>
      <div className="reaction">
        <button className="button btn-effect" disabled>
          <FontAwesomeIcon icon={faHeart} size="lg" />
        </button>
        <span className="count">0</span>
        <button className="button btn-effect" disabled>
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
        <button className="button btn-effect" disabled>
          <FontAwesomeIcon icon={faShareNodes} size="lg" />
        </button>
        <FlexGrowBox />
        <button className="button btn-effect" disabled>
          <FontAwesomeIcon icon={faBookmark} size="lg" />
        </button>
      </div>
    </>
  );
};

export default CreatorReaction;
