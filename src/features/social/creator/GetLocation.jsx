import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const GetLocation = ({ setSelect, location, setLocation }) => {
  const [access, setAccess] = useState(
    ["idle", "blocked"].includes(location) ? false : true
  );
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const getAddress = async (x, y) => {
    const KAKAO_REST_API_KEY = process.env.LOCATION_KAKAO_REST_API_KEY;
    const requestUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`;
    const config = {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    };
    try {
      const { data } = await axios.get(requestUrl, config);
      const {
        documents: [
          {
            address: { region_1depth_name, region_2depth_name },
          },
        ],
      } = data;
      setLocation(`${region_1depth_name} ${region_2depth_name}`);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeAccess = (e) => {
    setAccess(e.target.checked);
    if (e.target.checked) {
      const { geolocation } = navigator;
      const config = {
        enableHighAccuracy: true,
        timeout: 1000 * 10,
        maximumAge: 1000 * 3600 * 24,
      };
      if (!geolocation) {
        console.error("geolocation not supported");
        return;
      }

      setDisabled(true);
      geolocation.getCurrentPosition(handleSuccess, handleError, config);
      return;
    }
    setLocation("blocked");
  };

  const handleSuccess = ({ coords }) => {
    const { longitude, latitude } = coords;
    setDisabled(false);
    setError("");
    getAddress(longitude, latitude);
  };

  const handleError = (error) => {
    setAccess(false);
    setDisabled(false);
    if (error.code === 1) {
      setError("denied");
      return;
    }
    setError("failed");
  };

  const onClickSaveLocation = () => {
    if (location === "idle") {
      setLocation("blocked");
    }
    setSelect("idle");
  };

  const onClickCancleLocation = () => {
    setSelect("idle");
  };

  return (
    <>
      <div className="editor ani-fade-in">
        <label>
          <span>현재 위치 허용하기</span>
          <input
            className="toggle-button"
            type="checkbox"
            checked={access}
            onChange={onChangeAccess}
          />
        </label>
        <p className="info">위치 정보는 시, 구까지 제공됩니다.</p>
        {error === "denied" && (
          <div className="balloon-container ani-fade-in">
            <div className="balloon">
              <FontAwesomeIcon icon={faLocationDot} /> 위치 정보를 허용해주세요.
            </div>
          </div>
        )}
        <div className="submit">
          <button
            className="button btn-effect save"
            onClick={onClickSaveLocation}
            disabled={disabled}
          >
            저장
          </button>
          <button
            className="button btn-effect cancle"
            onClick={onClickCancleLocation}
            disabled={disabled}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default GetLocation;
