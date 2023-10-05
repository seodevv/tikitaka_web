import React, { useEffect, useRef, useState } from "react";
import {
  useDisableChatMutation,
  useGetChatMessageUnreadCountQuery,
  useUpdateChatPinedMutation,
} from "../chatApiSlice";
import { convertDate } from "../../../app/common";
import Profile from "../../../components/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCommentDots } from "@fortawesome/free-solid-svg-icons";

const Chat = ({
  chat,
  creator,
  active,
  setActive,
  typing,
  contextMenu,
  setContextMenu,
}) => {
  const dateString = chat.messageDate ? convertDate(chat.messageDate) : "";

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef(null);
  const onClickChatSelect = () => setActive(chat.id);
  const onContextMenuChat = (e) => {
    preventEvent(e);
    if (!offsetRef.current) return;

    const max_X = offsetRef.current.offsetWidth - 45;
    const offsetRef_X = offsetRef.current.getBoundingClientRect().x;
    const offsetRef_Y = offsetRef.current.getBoundingClientRect().y;
    const native_X = e.nativeEvent.offsetX;
    const native_Y = e.nativeEvent.offsetY;
    if (e.target === offsetRef.current) {
      setContextMenu(chat.id);
      setOffset((prev) => ({
        ...prev,
        x: max_X < native_X ? native_X - 50 : native_X,
        y: native_Y,
      }));
      return;
    }

    let currentX = e.target.getBoundingClientRect().x;
    let currentY = e.target.getBoundingClientRect().y;
    setContextMenu(chat.id);
    setOffset((prev) => ({
      ...prev,
      x:
        max_X < currentX - offsetRef_X + native_X
          ? currentX - offsetRef_X + native_X - 50
          : currentX - offsetRef_X + native_X,
      y: currentY - offsetRef_Y + native_Y,
    }));
  };
  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickContextMenu = (e) => {
    e.stopPropagation();
  };

  const [updatePined] = useUpdateChatPinedMutation();
  const onClickUpdatePined = async () => {
    setContextMenu("");
    try {
      await updatePined({ chatId: chat.id, creator });
    } catch (error) {
      console.error(error);
    }
  };

  const [disableChat] = useDisableChatMutation();
  const onClickDisabledChat = async () => {
    setContextMenu("");
    try {
      await disableChat({ chatId: chat.id, creator });
    } catch (error) {
      console.error(error);
    }
  };
  const onClickCloseContext = () => setContextMenu("");

  const { data, isSuccess, refetch } = useGetChatMessageUnreadCountQuery({
    chatId: chat.id,
    creator,
  });

  let badge;
  if (isSuccess) {
    badge = data.count !== 0 && (
      <div className="badge bd-none bd-circle text-center after-center">
        {data.count}
      </div>
    );
  }

  let messageSender;
  if (chat.messageUserId) {
    messageSender =
      creator === chat.messageUserId ? (
        <span className="me">you</span>
      ) : (
        <span className="other">other</span>
      );
  }

  let preview;
  if (["text", "href", "youtube"].includes(chat.messageType) && chat.message) {
    preview =
      chat.message.length > 25
        ? `${chat.message.substring(0, 25)}...`
        : chat.message;
  } else if (chat.messageType === "image") {
    preview = "image";
  }
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, []);

  return (
    <div
      className={`chat-list-item ${active === chat.id ? "active" : ""}`}
      onClick={onClickChatSelect}
      onContextMenu={onContextMenuChat}
      ref={offsetRef}
    >
      {contextMenu === chat.id && (
        <div
          className={`context-menu ${contextMenu ? "active" : ""}`}
          style={{ top: offset.y, left: offset.x }}
          onClick={onClickContextMenu}
          onContextMenu={preventEvent}
        >
          <li onClick={onClickCloseContext}>
            <FontAwesomeIcon icon={faCaretLeft} />
          </li>
          <li onClick={onClickUpdatePined}>
            {chat.pined ? "unPined" : "Pined"}
          </li>
          <li onClick={onClickDisabledChat}>Exit</li>
        </div>
      )}
      <Profile
        className="profile"
        type={chat.userType}
        profile={chat.profile}
      />
      {typing && (
        <div className="typing">
          <FontAwesomeIcon icon={faCommentDots} size="xl" beat />
        </div>
      )}
      <div className="info flex-grow">
        <h3 className={`${/[가-힣]/.test(chat.nick) ? "hangle" : ""}`}>
          {chat.nick}
        </h3>
        <p>
          {messageSender} {preview}
        </p>
      </div>
      <div className="badge-container">{badge}</div>
      <span className="time">{dateString}</span>
    </div>
  );
};

export default Chat;
