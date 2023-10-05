import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import VideoPlayer from "../article/VideoPlayer";
import ImageSlide from "../../../components/ImageSlide";

const CreatorMedia = ({ select, setSelect, type, media }) => {
  const [number, setNumber] = useState(0);
  const [offset, setOffset] = useState({ width: "360px", height: "450px" });
  const isMedias = media === "image" && Object.keys(media).length !== 1;

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickPrev = (e) => {
    preventEvent(e);
    setNumber((prev) => prev - 1);
  };
  const onClickNext = (e) => {
    preventEvent(e);
    setNumber((prev) => prev + 1);
  };
  const onClickControl = (index) => setNumber(index);
  const onClickSelectMedia = () => {
    if (select === "media" || media.video) return;
    setSelect("media");
  };

  let content;
  if (type === "idle") {
    content;
  }
  if (type === "image") {
    const mediaArray = Object.keys(media).map((m) => {
      return URL.createObjectURL(media[m]);
    });
    content = <ImageSlide mediaArray={mediaArray} width={offset.width} />;
  }
  if (type === "video") {
    content = (
      <VideoPlayer
        author={media.author}
        media={media.video}
        thumbnail={media.thumbnail}
        width={offset.width}
        height={offset.height}
      />
    );
  }

  useEffect(() => {
    if (window.innerWidth < 800) {
      setOffset({ width: "300px", height: "375px" });
    }
    const listener = (e) => {
      const innerWidth = e.target.innerWidth;
      if (innerWidth < 800) {
        setOffset({ width: "300px", height: "375px" });
      } else {
        setOffset({ width: "360px", height: "450px" });
      }
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return (
    <>
      <div
        className={`media ${
          media === "idle" && select !== "media"
            ? "create-mode-media"
            : "media-select"
        }`}
        onClick={onClickSelectMedia}
      >
        {content}
        {isMedias && number !== 0 && (
          <button className="prev" onClick={(e) => onClickPrev(e)}>
            <FontAwesomeIcon icon={faAngleLeft} size="2xl" />
          </button>
        )}
        {isMedias && number !== Object.keys(media).length - 1 && (
          <button className="next" onClick={(e) => onClickNext(e)}>
            <FontAwesomeIcon icon={faAngleRight} size="2xl" />
          </button>
        )}
        {isMedias && (
          <div className="control">
            {Object.keys(media).map((v, i) => {
              return (
                <button
                  key={i}
                  className="button"
                  onClick={() => onClickControl(i)}
                >
                  <FontAwesomeIcon
                    icon={faCircle}
                    color={i === number ? "#fff" : "#727272"}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CreatorMedia;
