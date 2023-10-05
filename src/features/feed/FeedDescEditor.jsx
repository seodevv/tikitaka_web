import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { usePostFeedsEditDescMutation } from "./feedApiSlice";

const FeedDescEditor = ({ userId, desc, setStatus }) => {
  const [text, setText] = useState(desc);
  const textRef = useRef(null);

  const onChangeText = (e) => {
    if (e.target.value.length > 150) return;
    setText(e.target.value);
    resizeHeight();
  };
  const resizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  };

  const [updateDesc] = usePostFeedsEditDescMutation();
  const onClickEditCancle = () => setStatus(false);
  const onClickEditProcess = async () => {
    if (desc === text) {
      setStatus(false);
      return;
    }
    try {
      await updateDesc({ userId, desc: text }).unwrap();
      setStatus(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    resizeHeight();
  }, []);

  return (
    <>
      <textarea
        ref={textRef}
        className="scroll-none"
        value={text}
        onChange={onChangeText}
        spellCheck="false"
      ></textarea>
      <div className="button-group">
        <FontAwesomeIcon
          className="button btn-effect transit-none"
          icon={faCircleChevronLeft}
          color="#727272"
          onClick={onClickEditCancle}
        />
        <FontAwesomeIcon
          className="button btn-effect transit-none"
          icon={faCircleCheck}
          color="#278839"
          onClick={onClickEditProcess}
        />
        <div className="flex-grow"></div>
        <span>[{text.length}/150]</span>
      </div>
    </>
  );
};

export default FeedDescEditor;
