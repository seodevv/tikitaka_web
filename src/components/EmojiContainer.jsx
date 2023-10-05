import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceSmile,
  faFutbol,
  faHeart,
  faLemon,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCat,
  faCircleExclamation,
  faClockRotateLeft,
  faEarthAmericas,
  faInbox,
  faMagnifyingGlass,
  faRocket,
  faScissors,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetEmojiTypeQuery,
  useSearchEmojisMutation,
} from "../features/social/socialApiSlice";
import { useEffect, useRef, useState } from "react";
import Emojis from "./Emojis";

library.add(
  faFaceSmile,
  faFutbol,
  faHeart,
  faLemon,
  faCat,
  faCircleExclamation,
  faClockRotateLeft,
  faEarthAmericas,
  faInbox,
  faRocket,
  faScissors,
  faXmark
);

const EmojiContainer = ({
  setInput,
  inputRef,
  setEmoji,
  background = "#fff",
  color = "#000",
}) => {
  const [type, setType] = useState("recents");
  let style = {
    background,
    color,
  };

  const [searchWord, setSearchWord] = useState("");
  const onChangeSearchWord = (e) => setSearchWord(e.target.value);
  const [searchEmojis] = useSearchEmojisMutation();
  const [search, setSearch] = useState(null);
  const onKeyDownSearchWrod = async (e) => {
    if (e.keyCode === 13) {
      if (!searchWord) {
        setType("recents");
        return;
      }
      setType("search");
      setSearch(null);
      try {
        const response = await searchEmojis({ searchWord }).unwrap();
        setSearch(response);
      } catch (erorr) {
        console.error(error);
      }
    }
  };

  const { data: types, isSuccess, isFetching } = useGetEmojiTypeQuery();
  const onClickChangeType = (type) => {
    if (timer.current && timer.current > 100) {
      timer.current = null;
      return;
    }
    setType(type);
  };

  let buttons;
  if (isSuccess && !isFetching) {
    buttons = types.map((v) => (
      <button
        key={v.index}
        className={`button ${type === v.type ? "active" : ""}`}
        onClick={() => onClickChangeType(v.type)}
      >
        <FontAwesomeIcon icon={`${v.iconType} ${v.icon}`} />
      </button>
    ));
  }

  const [flag, setFlag] = useState(false);
  const maxX = types ? types.length * 35 - 180 + 12 : 0;
  const currentX = useRef(0);
  const clientX = useRef(null);
  const tempX = useRef(null);
  const typeRef = useRef(null);
  const timer = useRef(null);
  const onMouseDown = (e) => {
    clientX.current = e.clientX;
    setFlag(true);
    timer.current = new Date();
  };
  const onMouseMove = (e) => {
    if (flag && typeRef.current) {
      tempX.current = currentX.current - (clientX.current - e.clientX);
      if (tempX.current > 0) {
        tempX.current = 0;
      } else if (tempX.current < -maxX) {
        tempX.current = -maxX;
      }
      typeRef.current.style.transform = `translateX(${tempX.current}px)`;
    }
  };
  const onMouseUp = () => {
    setFlag(false);
    currentX.current = tempX.current;
    timer.current = new Date() - timer.current;
  };
  const onMouseLeave = () => {
    setFlag(false);
    currentX.current = tempX.current;
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        setEmoji(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <>
      <div className="emoji-container" style={style}>
        <div className="emoji-search-bar">
          <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
          <input
            value={searchWord}
            onChange={onChangeSearchWord}
            onKeyDown={onKeyDownSearchWrod}
          />
        </div>
        <div className="emoji-type scroll-none">
          <div
            ref={typeRef}
            style={{
              width: `${buttons ? buttons.length * 35 : 0}px`,
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {buttons}
          </div>
        </div>
        <Emojis
          type={type}
          search={search}
          setInput={setInput}
          inputRef={inputRef}
          setEmoji={setEmoji}
        />
      </div>
    </>
  );
};

export default EmojiContainer;
