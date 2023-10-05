import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { convertTime, getFormatDate } from "../../../app/common";
import classNames from "classnames";
import Message from "./Message";
import Profile from "../../../components/Profile";

const MessageBox = ({
  chatId,
  userInfo,
  data,
  observer,
  setEnlarge,
  scrollRef,
  prevScrollTop,
  setProfileDetail,
}) => {
  const time = convertTime(data.date);
  const classnames = classNames(
    `chat-stream ${data.other ? "other" : "me"} ${
      data.last ? "show" : ""
    }_${getFormatDate(data.date)}`
  );

  const [element, setElement] = useState(null);
  useEffect(() => {
    if (element) {
      observer.observe(element);
    }
  }, [element]);

  const onClickProfile = () => setProfileDetail(userInfo);

  return (
    <>
      {data.newDate && (
        <div id={getFormatDate(data.date)} className="contour">
          <span className="time">
            <FontAwesomeIcon icon={faCalendarDays} size="lg" />
            &nbsp;&nbsp;
            {getFormatDate(data.date, " / ")}
          </span>
        </div>
      )}
      <div
        ref={setElement}
        className={classnames}
        data-date={getFormatDate(data.date)}
      >
        {data.other && (
          <Profile
            className="profile"
            type={userInfo.type}
            profile={userInfo.profile}
            onClick={onClickProfile}
          />
        )}
        <div className={!data.other ? "align text-end" : "align"}>
          <div>
            {data.other ? (
              <>
                <p className="name">{userInfo.nick}</p>
                <span className="time">{time}</span>
              </>
            ) : (
              <>
                <span className="time">{time}</span>
                <p className="name">You</p>
              </>
            )}
          </div>
          {data.messages.map((v) => (
            <Message
              key={v.id}
              chatId={chatId}
              data={v}
              setEnlarge={setEnlarge}
              scrollRef={scrollRef}
              prevScrollTop={prevScrollTop}
            />
          ))}
        </div>
        {!data.other && (
          <Profile
            className="profile"
            type={userInfo.type}
            profile={userInfo.profile}
            onClick={onClickProfile}
          />
        )}
      </div>
    </>
  );
};

export default MessageBox;
