import { useRef, useState } from 'react';
import TagSearch from './TagSearch';

const GetContent = ({ post, setPost, tags, setTags, setSelect }) => {
  const [text, setText] = useState(post === 'idle' ? '' : post);
  const [tempTags, setTempTags] = useState(
    tags === 'idle' ? [] : tags.split(',').filter((v) => v !== '')
  );
  const textRef = useRef(null);

  const onChangeText = (e) => {
    if (e.target.value.length > 150) return;
    setText(e.target.value);
  };

  const onClickSaveContent = () => {
    if (!text) {
      textRef.current.classList.remove('incorrect-input');
      textRef.current.offsetWidth;
      textRef.current.classList.add('incorrect-input');
      return;
    }
    setPost(text);
    setTags(tempTags.toString() + ',');
    setSelect('idle');
  };

  const onCLickCancleContent = () => {
    setSelect('idle');
  };

  return (
    <>
      <div className="editor ani-fade-in">
        <textarea
          className="textarea scroll-none"
          placeholder="내용을 입력해보세요."
          value={text}
          onChange={onChangeText}
          ref={textRef}
          spellCheck="false"
        ></textarea>
        <p className="info">[{text.length} / 150]</p>
        <TagSearch tempTags={tempTags} setTempTags={setTempTags} />
        <div className="submit">
          <button
            className="button btn-effect save"
            onClick={onClickSaveContent}
          >
            저장
          </button>
          <button
            className="button btn-effect cancle"
            onClick={onCLickCancleContent}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default GetContent;
