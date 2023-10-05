import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectCreator } from "../../login/loginReducer";
import { getKoreaDate } from "../../../app/common";
import Profile from "../../../components/Profile";
import Ago from "../../../components/Ago";

const CreatorHeader = ({ select, setSelect, location }) => {
  const creator = useSelector(selectCreator);
  const type = creator ? creator.type : "App";
  const nick = creator ? creator.nick : "unknown";
  const profile = creator ? creator.profile : "profile.png";
  const date = getKoreaDate(new Date()).toISOString();

  const isHangle = /[가-힣]/.test(nick);

  const onClickSelectLocation = () => {
    if (select === "location") return;
    setSelect("location");
  };

  let content;
  let style = {
    padding: "3px 6px",
    fontSize: "0.9rem",
  };
  if (location === "idle") {
    content = "위치를 추가해보세요.";
    style.color = "#fff";
    style.background = "rgba(0,0,0,0.75)";
  } else if (location === "blocked") {
    content = "위치 정보 표시 안함";
    style.color = "#f00";
  } else {
    content = location;
  }

  return (
    <>
      <div
        className={`header ${
          location === "idle" && select !== "location" ? "create-mode" : ""
        }`}
        onClick={onClickSelectLocation}
      >
        <Profile className="profile" type={type} profile={profile} />
        <div className="post-info">
          <h4 className={`nick ${isHangle ? "hangle" : ""}`}>{nick}</h4>
          <Ago className="time" date={date} />
          <div className="location" style={style}>
            <FontAwesomeIcon icon={faLocationArrow} />
            &nbsp; {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorHeader;
