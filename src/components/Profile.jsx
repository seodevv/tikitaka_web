import { memo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Profile = memo(
  ({
    className = "profile",
    type = "App",
    profile = "profile.png",
    onClick,
    edit,
    setStatus,
    setMessage,
  }) => {
    let profileUrl;
    switch (type) {
      case "App":
        profileUrl = process.env.SERVER_URL + "/img/profile/" + profile;
        break;
      case "github":
      case "naver":
      case "google":
      case "kakao":
        if (profile.search(/^http/) !== -1) {
          profileUrl = profile;
        } else {
          profileUrl = process.env.SERVER_URL + "/img/profile/" + profile;
        }
        break;
    }

    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef(null);
    const onChangeImageFile = () => {
      if (!imgRef.current) return;

      const files = imgRef.current.files;
      if (files.length === 0) {
        setImgFile("");
        setStatus("idle");
        return;
      }

      const allowedExt = [".png", ".jpg", ".jpeg", ".gif"];
      const ext = files[0].name.substring(files[0].name.lastIndexOf("."));
      if (!allowedExt.includes(ext)) {
        setMessage("Image Only (jpg, jpeg, png, gif)");
        imgRef.current.value = "";
        return;
      }

      if (files[0].size / 1024 / 1024 > 5) {
        setMessage("File too large (Limit 5MB)");
        imgRef.current.value = "";
        return;
      }

      const file = imgRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
      setStatus(imgRef.current.files[0]);
    };

    const onClickImageReset = () => {
      setImgFile("");
      setStatus("idle");
      if (imgRef.current) imgRef.current.value = "";
    };

    return (
      <div className={`${edit ? "profile-edit" : ""}`}>
        <img
          className={`${className ? className : ""} bd-none bd-circle`}
          src={imgFile ? imgFile : profileUrl}
          alt="profile"
          onClick={onClick}
          draggable="false"
        />
        {imgFile && (
          <button className="cancle btn-effect" onClick={onClickImageReset}>
            <FontAwesomeIcon icon={faXmark} size="2xl" />
          </button>
        )}
        {edit && (
          <>
            <label htmlFor="edit" className="edit after-center">
              Edit
            </label>
            <input
              id="edit"
              className="d-none"
              type="file"
              accept="image/*"
              ref={imgRef}
              onChange={onChangeImageFile}
            />
          </>
        )}
      </div>
    );
  }
);

export default Profile;
