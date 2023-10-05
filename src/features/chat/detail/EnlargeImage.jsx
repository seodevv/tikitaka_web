import { useEffect, useLayoutEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const EnlargeImage = ({ chatId, imagesContent, enlarge, setEnlarge }) => {
  const imgRef = useRef(null);
  let prev = -1;
  let next = -1;
  if (imagesContent && imagesContent.length > 1) {
    const current = imagesContent.findIndex((image) => image === enlarge);
    if (current >= imagesContent.length - 1) {
      prev = current - 1;
    } else if (current <= 0) {
      next = current + 1;
    } else {
      prev = current - 1;
      next = current + 1;
    }
  }
  const onClickPrev = () => setEnlarge(imagesContent[prev]);
  const onClickNext = () => setEnlarge(imagesContent[next]);
  const onClickClose = () => setEnlarge("");

  useLayoutEffect(() => {
    imgRef.current.classList.remove("fade-slide-in");
    imgRef.current.offsetWidth;
    imgRef.current.classList.add("fade-slide-in");
  }, [enlarge]);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        setEnlarge("");
      }
      if (e.keyCode === 37 && prev !== -1) {
        setEnlarge(imagesContent[prev]);
      }
      if (e.keyCode === 39 && next !== -1) {
        setEnlarge(imagesContent[next]);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [enlarge]);

  useEffect(() => {
    return () => setEnlarge("");
  }, [chatId]);

  const imageUrl = `${process.env.SERVER_URL}/img/chat/${chatId}/${enlarge}`;
  const download = enlarge.substring(enlarge.search(/\d{13}_/) + 14);

  return (
    <div className="enlarge-image">
      <img
        className="image fade-slide-in"
        ref={imgRef}
        src={imageUrl}
        alt="enlarge"
      />
      {prev !== -1 && (
        <button className="prev button btn-effect" onClick={onClickPrev}>
          <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
        </button>
      )}
      {next !== -1 && (
        <button className="next button btn-effect" onClick={onClickNext}>
          <FontAwesomeIcon icon={faChevronRight} size="2xl" />
        </button>
      )}
      <button className="close button btn-effect" onClick={onClickClose}>
        <FontAwesomeIcon icon={faXmark} size="2xl" />
      </button>
      <a className="download btn-effect" href={imageUrl} download={download}>
        <FontAwesomeIcon icon={faDownload} size="xl" />
      </a>
    </div>
  );
};

export default EnlargeImage;
