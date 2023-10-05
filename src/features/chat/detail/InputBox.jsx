import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faLink,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import {
  emitChatMessage,
  emitTyping,
  updateChatListQueryData,
} from '../../../app/store';
import Button from '../../../components/Button';
import ImagePreview from './ImagePreview';
import { useAddChatMessageMutation } from '../chatApiSlice';

const InputBox = ({ chatId, creator, target, onScrollTo }) => {
  const [text, setText] = useState('');
  const textRef = useRef(null);
  const onChangeText = (e) => setText(e.target.value.substring(0, 512));
  const onFocusText = (e) => {
    if (target) {
      emitTyping('active', chatId, target);
    }
  };
  const onBlurText = (e) => emitTyping('inActive', chatId, target);

  const [addChatMessage] = useAddChatMessageMutation();
  const fetchChatMessage = useCallback(async () => {
    try {
      const response = await addChatMessage({
        chatId,
        creator,
        message: text,
      }).unwrap();

      if (target) {
        emitChatMessage(response, target);
      }

      updateChatListQueryData(creator, text, response);
      setText('');

      if (response.type !== 'text') {
        setTimeout(() => {
          onScrollTo('bottom');
        }, 1000);
      } else {
        onScrollTo('bottom');
      }

      if (textRef.current) textRef.current.focus();
    } catch (error) {
      console.error(error);
    }
  });

  const wrongText = () => {
    textRef.current.classList.remove('incorrect-input');
    textRef.current.offsetWidth;
    textRef.current.classList.add('incorrect-input');
  };
  const onkeyDownText = useCallback(async (e) => {
    if (e.keyCode === 13 && linkActive) {
      const regex =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/;

      if (regex.test(e.target.value)) {
        fetchChatMessage();
        resetAdvancedButton();
        return;
      }
      wrongText();
      return;
    }

    if (e.keyCode === 13 && youtubeActive) {
      const regex =
        /(?:http:|https:)?(?:\/\/)?(?:www\.)?(?:youtube.com|youtu.be)\/(?:watch|embed)?(?:\?v=|\/)?(\S+)?/;

      if (regex.test(e.target.value) && e.target.value.match(regex)[1]) {
        fetchChatMessage();
        resetAdvancedButton();
        return;
      }
      wrongText();
      return;
    }

    if (e.keyCode === 27 && (linkActive || youtubeActive)) {
      resetAdvancedButton();
      return;
    }

    if (e.keyCode === 13 && !e.nativeEvent.isComposing && text) {
      fetchChatMessage();
      return;
    }
  });

  const onClickSend = useCallback(() => {
    fetchChatMessage();
  });

  const linkRef = useRef(null);
  const youtubeRef = useRef(null);
  const [linkActive, setLinkActive] = useState(false);
  const [youtubeActive, setYoutubeActive] = useState(false);
  const resetAdvancedButton = () => {
    if (youtubeRef.current && linkRef.current && textRef.current) {
      youtubeRef.current.classList.remove('link-on');
      linkRef.current.classList.remove('link-on');
      textRef.current.classList.remove('link-mode');
      setYoutubeActive(false);
      setLinkActive(false);
      setText('');
    }
  };
  const toggleAdvBtn = (type) => {
    if (youtubeRef.current && linkRef.current && textRef.current) {
      youtubeRef.current.classList.remove('link-on');
      linkRef.current.classList.remove('link-on');
      textRef.current.classList.add('link-mode');
      textRef.current.focus();
      switch (type) {
        case 'link':
          if (!linkActive) {
            linkRef.current.classList.add('link-on');
            setLinkActive(true);
            setYoutubeActive(false);
            setText('http://');
            return;
          }
          resetAdvancedButton();
          break;
        case 'youtube':
          if (!youtubeActive) {
            youtubeRef.current.classList.add('link-on');
            setYoutubeActive(true);
            setLinkActive(false);
            setText('http://www.youtube.com/');
            return;
          }
          resetAdvancedButton();
          break;
      }
    }
  };
  const onClickAdvBtn = (e) => {
    if (e.currentTarget === linkRef.current) {
      toggleAdvBtn('link');
    } else if (e.currentTarget === youtubeRef.current) {
      toggleAdvBtn('youtube');
    }
  };

  const [imgFile, setImgFile] = useState('');
  const imgRef = useRef(null);
  const [warning, setWarning] = useState('');
  const popupWarning = (message) => {
    setWarning(message);
    setTimeout(() => {
      setWarning('');
    }, 3000);
    setImgFile('');
    imgRef.current.value = '';
  };
  const onChangeImageFile = () => {
    if (!imgRef.current) return;

    if (linkActive || youtubeActive) {
      resetAdvancedButton();
    }

    const files = imgRef.current.files;
    if (files.length === 0) {
      setImgFile('');
      return;
    }

    if (files[0].size / 1024 / 1024 / 5 > 1) {
      popupWarning('File too large (Limit 5MB)');
      return;
    }

    const allowedExt = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = files[0].name.substring(files[0].name.lastIndexOf('.'));
    if (!allowedExt.includes(ext)) {
      popupWarning('Image Only (jpg, jpeg, png, gif)');
      return;
    }

    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  useEffect(() => {
    return () => resetAdvancedButton();
  }, [chatId]);

  useEffect(() => {
    if (target && textRef.current) {
      textRef.current.focus();
    }
  }, [target]);

  return (
    <div className="input-box p-relative">
      {(linkActive || youtubeActive) && (
        <div className="alert desc">종료하시려면 ESC 를 누르세요.</div>
      )}
      {warning && <div className="alert warning">{warning}</div>}
      {imgFile && (
        <ImagePreview
          chatId={chatId}
          target={target}
          creator={creator}
          imgFile={imgFile}
          setImgFile={setImgFile}
          imgRef={imgRef}
          onScrollTo={onScrollTo}
        />
      )}
      <input
        className="input-effect"
        type="text"
        ref={textRef}
        value={text}
        onChange={(e) => onChangeText(e)}
        onFocus={onFocusText}
        onBlur={onBlurText}
        onKeyDown={(e) => onkeyDownText(e)}
        disabled={imgFile}
      />
      <div className="attachment-group">
        <button
          className="attachment link btn-effect bd-none"
          ref={linkRef}
          onClick={(e) => onClickAdvBtn(e)}
          disabled={imgFile}
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button
          className="attachment btn-effect bd-none"
          ref={youtubeRef}
          onClick={onClickAdvBtn}
          disabled={imgFile}
        >
          <FontAwesomeIcon icon={faYoutube} />
        </button>
        <label htmlFor="attachment" className="attachment btn-effect">
          <FontAwesomeIcon icon={faImage} />
        </label>
        <input
          id="attachment"
          className="hidden"
          type="file"
          accept="image/*"
          name="image"
          ref={imgRef}
          onChange={onChangeImageFile}
        />
      </div>
      <Button
        className="send btn-effect"
        icon={faPaperPlane}
        size="lg"
        color="#fff"
        onClick={onClickSend}
        disabled={imgFile}
      />
    </div>
  );
};

export default InputBox;
