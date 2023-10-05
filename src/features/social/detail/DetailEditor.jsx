import { useEffect, useRef, useState } from "react";
import TagSearch from "../creator/TagSearch";
import { FlexGrowBox } from "../../../components/Styled";
import { useEditSocialMutation } from "../socialApiSlice";
import { setModal, showMessage } from "../socialReducer";
import { useDispatch } from "react-redux";

const DetailEditor = ({ socialId, content, tags }) => {
  const [text, setText] = useState(content);
  const [tempTag, setTempTag] = useState(
    tags.split(",").filter((v) => v !== "")
  );
  const textRef = useRef(null);
  const onChangeText = (e) => {
    setText(e.target.value);
    resizeHeight();
  };
  const resizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  };

  const dispatch = useDispatch();
  const [editSocial] = useEditSocialMutation();
  const onClickEdit = async () => {
    try {
      await editSocial({
        socialId,
        content: text,
        tags: tempTag.toString(),
      }).unwrap();
      dispatch(setModal(false));
    } catch (error) {
      console.error(error);
      dispatch(showMessage("Server error, please try again"));
    }
  };
  const onClickCancle = () => dispatch(setModal(false));

  useEffect(() => {
    resizeHeight();
  }, []);

  return (
    <>
      <div className="content ani-fade-in">
        <textarea
          className="scroll-none"
          placeholder="내용을 입력해보세요."
          ref={textRef}
          value={text}
          onChange={onChangeText}
          spellCheck="false"
        ></textarea>
        <div className="button-group">
          <div className="flex-grow"></div>
          <span>[{text.length}/150]</span>
        </div>
        <TagSearch tempTags={tempTag} setTempTags={setTempTag} />
      </div>
      <FlexGrowBox />
      <div className="confirm-box">
        <button
          className="edit button btn-effect transit-none"
          onClick={onClickEdit}
        >
          수정
        </button>
        <button
          className="cancle button btn-effect transit-none"
          onClick={onClickCancle}
        >
          취소
        </button>
      </div>
    </>
  );
};

export default DetailEditor;
