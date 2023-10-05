import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faExpand,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { FlexGrowBox } from "../../../components/Styled";
import Profile from "../../../components/Profile";
import Ago from "../../../components/Ago";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { showArticle, showModal } from "../socialReducer";

const ArticleHeader = memo(({ socialId, ids, data }) => {
  const dispatch = useDispatch();
  const isHangle = /[가-힣]/.test(data.nick);

  let content;
  let style;
  if (data.location !== "blocked") {
    content = (
      <div className="location">
        <FontAwesomeIcon icon={faLocationArrow} />
        &nbsp; {data.location}
      </div>
    );
  } else {
    style = {
      marginTop: "10px",
    };
  }

  return (
    <>
      <div className="header">
        <Profile
          className="profile"
          type={data.userType}
          profile={data.profile}
        />
        <div className="post-info" style={style}>
          <h4 className={`nick ${isHangle ? "hangle" : ""}`}>{data.nick}</h4>
          <Ago className="time" date={data.modified} />
          {content}
        </div>
        <FlexGrowBox />
        <button
          className="button btn-effect d-block transit-none"
          onClick={() => dispatch(showArticle({ id: socialId, ids: ids }))}
        >
          <FontAwesomeIcon icon={faExpand} />
        </button>
        <button
          className="button btn-effect d-block transit-none"
          onClick={() =>
            dispatch(
              showModal({ id: socialId, type: "social", userId: data.userId })
            )
          }
        >
          <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
        </button>
      </div>
    </>
  );
});

export default ArticleHeader;
