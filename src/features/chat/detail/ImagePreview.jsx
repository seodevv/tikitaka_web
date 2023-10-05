import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAddChatMessageImageMutation } from "../chatApiSlice";
import {
  emitChatMessage,
  updateChatListQueryData,
} from "../../../app/store.js";

const ImagePreview = ({
  chatId,
  target,
  creator,
  imgFile,
  setImgFile,
  imgRef,
  onScrollTo,
}) => {
  const closePreview = () => {
    setImgFile("");
    imgRef.current.value = null;
  };

  const onClickClose = () => closePreview();

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        closePreview();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  const [addImage] = useAddChatMessageImageMutation();
  const onClickUpload = async () => {
    try {
      const response = await addImage({
        chatId,
        creator,
        image: imgRef.current.files[0],
      }).unwrap();
      // console.log("response", response);
      if (response) {
        setImgFile("");
        onScrollTo("bottom");
        emitChatMessage(response, target);
        updateChatListQueryData(creator, response.message, response);
      }
    } catch (error) {
      console.error("[failed upload]", error);
    }
  };

  return (
    <div className="attachment-preview">
      <img className="image" src={imgFile ? imgFile : ""} alt="image" />
      <button className="button close btn-effect" onClick={onClickClose}>
        <FontAwesomeIcon icon={faXmark} size="2xl" color="#ccc" />
      </button>
      <button className="button upload btn-effect" onClick={onClickUpload}>
        <FontAwesomeIcon icon={faSquareCaretUp} size="2xl" color="#fff" />
      </button>
    </div>
  );
};

export default ImagePreview;
