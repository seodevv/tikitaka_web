import {
  faAngleLeft,
  faAngleRight,
  faCircle,
  faHeart,
  faHeartCrack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ImageSlide = ({ author, mediaArray, like, setLike, width = "300px" }) => {
  const [current, setCurrent] = useState(0);
  const [flag, setFlag] = useState("idle");

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickPrev = (e) => {
    preventEvent(e);
    setCurrent((prev) => prev - 1);
  };
  const onClickNext = (e) => {
    preventEvent(e);
    setCurrent((prev) => prev + 1);
  };
  const onClickControl = (index) => setCurrent(index);

  const onDoubleClick = () => {
    if (!setLike) return;
    if (like) setFlag("unlike");
    else setFlag("like");

    setLike("like");
  };

  let content;
  if (mediaArray) {
    content = mediaArray.map((m, i) => {
      const imagePath =
        m.search(/^blob|^data/) === -1
          ? `${process.env.SERVER_URL}/img/social/${author}/`
          : "";
      const [_, num, unit] = width.match(/(\d+)(.*)/);
      const style = {
        transform: `translateX(${current * -num}${unit})`,
      };
      return (
        <img
          className="image"
          key={i}
          src={imagePath + m}
          alt={m}
          style={style}
          draggable="false"
          onDoubleClick={onDoubleClick}
        />
      );
    });
  }

  const isMedias = mediaArray.length !== 1;
  const isFirst = current === 0;
  const isLast = current === mediaArray.length - 1;

  return (
    <>
      {content}
      {isMedias && !isFirst && (
        <button className="prev" onClick={(e) => onClickPrev(e)}>
          <FontAwesomeIcon icon={faAngleLeft} size="2xl" />
        </button>
      )}
      {isMedias && !isLast && (
        <button className="next" onClick={(e) => onClickNext(e)}>
          <FontAwesomeIcon icon={faAngleRight} size="2xl" />
        </button>
      )}
      {isMedias && (
        <div className="control">
          {mediaArray.map((v, i) => {
            return (
              <button
                key={i}
                className="button"
                onClick={() => onClickControl(i)}
              >
                <FontAwesomeIcon
                  icon={faCircle}
                  color={i === current ? "#fff" : "#727272"}
                />
              </button>
            );
          })}
        </div>
      )}
      {flag === "like" ? (
        <div className="like ani-fade-in-out-A">
          <FontAwesomeIcon className="border" icon={faHeart} color="#cc2020" />
        </div>
      ) : flag === "unlike" ? (
        <div className="like ani-fade-in-out-B">
          <FontAwesomeIcon
            className="border"
            icon={faHeartCrack}
            color="#fff"
          />
        </div>
      ) : null}
    </>
  );
};

export default ImageSlide;
