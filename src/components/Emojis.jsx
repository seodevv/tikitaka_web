import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useGetEmojisQuery } from "../features/social/socialApiSlice";

const Emojis = ({ type, search, setInput, inputRef, setEmoji }) => {
  const recents = JSON.parse(localStorage.getItem("emojis"));
  let content = recents ? recents : [];

  const onClickAddRecent = (emoji) => {
    const index = content.findIndex((v) => v.id === emoji.id);
    if (index !== -1) {
      content.splice(index, 1);
    }
    content.unshift(emoji);

    if (content.length > 20) {
      content.splice(content.length - 1, 1);
    }
    localStorage.setItem("emojis", JSON.stringify(content));

    setInput(
      (prev) => prev + String.fromCodePoint(parseInt(emoji.unicode, 16))
    );
    setEmoji(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const createEmojis = (emojis) => {
    return (
      <div className="emoji-group scroll-none">
        {emojis.map((emoji) => {
          const string = String.fromCodePoint(parseInt(emoji.unicode, 16));
          return (
            <button
              key={emoji.id}
              className="button btn-effect"
              onClick={() => onClickAddRecent(emoji)}
            >
              {string}
            </button>
          );
        })}
      </div>
    );
  };

  if (type === "recents") {
    return <>{createEmojis(content)}</>;
  }

  if (type === "search") {
    if (!search) {
      return (
        <>
          <div className="emoji-loading text-center">
            <FontAwesomeIcon icon={faSpinner} size="xl" spin />
          </div>
        </>
      );
    }
    return <>{createEmojis(search)}</>;
  }

  const { data: emojis, isSuccess, isFetching } = useGetEmojisQuery(type);

  if (isSuccess && !isFetching) {
    return <>{createEmojis(emojis)}</>;
  } else {
    return <div className="emoji-group scroll-none"></div>;
  }
};

export default Emojis;
