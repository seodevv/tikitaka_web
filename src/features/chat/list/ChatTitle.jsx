import React from "react";
import Title from "../../../components/Title";
import { FlexGrowBox } from "../../../components/Styled";
import Button from "../../../components/Button";
import { faComment } from "@fortawesome/free-regular-svg-icons";

const ChatTitle = ({ setSearch }) => {
  const onClickAddChat = () => {
    setSearch(true);
  };
  return (
    <div className="chat-box-title flex-row-no flex-justify-start flex-align-center">
      <Title text="Chat" />
      <FlexGrowBox />
      <div>
        <Button
          className="bd-none bd-circle"
          icon={faComment}
          size="lg"
          onClick={onClickAddChat}
        />
      </div>
    </div>
  );
};

export default ChatTitle;
