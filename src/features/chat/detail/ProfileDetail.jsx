import { useEffect } from "react";
import Profile from "../../../components/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const convertBirth = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year === 1900) {
    return "unknown";
  }

  return `${month}월 ${day}일`;
};

const ProfileDetail = ({ profileDetail, setProfileDetail }) => {
  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        setProfileDetail("");
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [profileDetail]);

  const onClickClose = () => {
    setProfileDetail("");
  };

  const { type, email, nick, profile, birth, regist } = profileDetail;

  return (
    <>
      <div className="profile-detail after-center">
        <button className="close btn-effect" onClick={onClickClose}>
          <FontAwesomeIcon icon={faXmark} size="2xl" />
        </button>
        <div className="d-inlineblock">
          <Profile className="image" type={type} profile={profile} />
          <table className="table">
            <tbody>
              <tr>
                <td>Nick</td>
                <td>{nick}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  {email ? <a href={`mailto:${email}`}>{email}</a> : "unknown"}
                </td>
              </tr>
              <tr>
                <td>Birth</td>
                <td>{convertBirth(birth)}</td>
              </tr>
              <tr>
                <td>regist</td>
                <td>{regist}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;
