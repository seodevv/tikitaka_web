import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GetLocation from "./GetLocation";

const CreatorEditor = ({}) => {
  return (
    <>
      <div className="creator-editor">
        <div className="arrow  ani-fade-in">
          <FontAwesomeIcon icon={faAnglesRight} />
        </div>
        <GetLocation />
      </div>
    </>
  );
};

export default CreatorEditor;
