import { useEffect, useRef, useState } from 'react';
import ImageSlide from '../../../components/ImageSlide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretLeft,
  faCaretRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import VideoEditor from './VideoEditor';
import {
  useDeleteTempVideoMutation,
  useEditTempVideoMutation,
  useGetThumbnailMutation,
  useUploadTempVideoMutation,
} from '../socialApiSlice';
import Button from '../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreator } from '../../login/loginReducer';
import { processingCreative, showMessage } from '../socialReducer';

const GetMedia = ({ setSelect, type, setType, media, setMedia, creative }) => {
  const creator = useSelector(selectCreator);
  const [mediaType, setMediaType] = useState(type !== 'idle' ? type : '');
  const [image, setImage] = useState(
    (type = 'image' && media === 'idle' ? {} : media)
  );
  const [video, setVideo] = useState('');
  const [next, setNext] = useState(false);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const onChangeImageFile = () => {
    if (!imageRef.current) return;
    videoRef.current.value = '';

    const files = imageRef.current.files;
    if (files.length > 5) {
      dispatch(showMessage('이미지는 최대 5장까지 가능합니다.'));
      imageRef.current.value = '';
      return;
    }

    const allow = ['.jpg', '.jpeg', '.png', '.gif'];
    let isStoppedByExt;
    let isStoppedBySize;
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name
        .substring(files[i].name.lastIndexOf('.'))
        .toLowerCase();
      const mb = files[i].size / 1024 / 1024;
      if (!allow.includes(ext)) {
        isStoped = true;
        break;
      } else if (mb > 10) {
        isStoppedBySize = true;
        break;
      }
    }

    if (isStoppedByExt) {
      dispatch(showMessage('파일 확장자를 확인해주세요.'));
      imageRef.current.value = '';
      return;
    } else if (isStoppedBySize) {
      dispatch(showMessage('10MB 이하의 이미지만 등록해주세요.'));
      imageRef.current.value = '';
      return;
    }

    setImage(files);
    setMediaType(files.length !== 0 ? 'image' : null);
  };

  const [uploadTempVideo] = useUploadTempVideoMutation();
  const [getThumbnail] = useGetThumbnailMutation();
  const onChangeVideoFile = async () => {
    if (!videoRef.current) return;
    imageRef.current.value = '';

    const file = videoRef.current.files[0];
    if (!file) {
      setMediaType('');
      return;
    }

    const mb = file.size / 1024 / 1024;
    if (mb > 100) {
      videoRef.current.value = '';
      dispatch(showMessage('100MB 이하의 동영상만 등록해주세요.'));
      return;
    }

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allow = ['.mp4', '.mov'];
    if (!allow.includes(ext)) {
      videoRef.current.value = '';
      dispatch(showMessage('파일 확장자를 확인해주세요.'));
      return;
    }

    const formData = new FormData();
    formData.append('type', 'temp');
    formData.append('video', file);
    try {
      setMediaType('video');
      setVideo({ isLoading: true });
      dispatch(processingCreative(true));
      const { url, filename } = await uploadTempVideo(formData).unwrap();
      const { path, thumbnails, duration } = await getThumbnail({
        url: url,
        width: 320,
      }).unwrap();
      setVideo({
        isLoading: false,
        url: url,
        full: `${process.env.SERVER_URL}/${path}/${filename}`,
        filename: filename,
        path: path,
        thumbnails: thumbnails,
        thumbnail: 0,
        duration: duration,
        startTime: 0,
        endTime: 1,
        totalTime: duration,
      });
      dispatch(processingCreative(false));
    } catch (error) {
      console.error(error);
      setMediaType('');
    }
  };

  const [active, setActive] = useState(0);
  const isFirst = active === 0;
  const isLast = active === Object.keys(image).length - 1;
  const onChangeActive = (i) => setActive(i);
  const onChangeOrder = (type) => {
    switch (type) {
      case 'left': {
        setActive((prev) => prev - 1);
        setImage((prev) => {
          const copy = { ...prev };
          const temp = copy[active - 1];
          copy[active - 1] = copy[active];
          copy[active] = temp;
          return copy;
        });

        break;
      }
      case 'right': {
        setActive((prev) => prev + 1);
        setImage((prev) => {
          const copy = { ...prev };
          const temp = copy[active + 1];
          copy[active + 1] = copy[active];
          copy[active] = temp;
          return copy;
        });

        break;
      }
    }
  };

  const [editTempVideo, { isLoading }] = useEditTempVideoMutation();
  const onClickSaveMedia = async () => {
    if (isImage) {
      setType('image');
      setMedia(image);
      setSelect('idle');
    } else if (isVideo) {
      try {
        dispatch(processingCreative(true));
        const response = await editTempVideo({
          creator: creator.id,
          video: video,
        }).unwrap();
        setType('video');
        setMedia({
          author: creator.id,
          video: response.video,
          thumbnail: response.thumbnail,
        });
        setSelect('idle');
        dispatch(processingCreative(false));
      } catch (error) {
        console.error(error);
      }
    }
  };
  const onClickNext = () => {
    setNext((prev) => !prev);
  };
  const onClickCancleMedia = () => {
    setSelect('idle');
  };

  let preview;
  let isImage = mediaType === 'image';
  let isVideo = mediaType === 'video';
  let imageArray = [];
  if (isImage) {
    for (let i = 0; i < Object.keys(image).length; i++) {
      imageArray.push(URL.createObjectURL(image[i]));
    }
    preview = (
      <div className="preview">
        <ImageSlide mediaArray={[imageArray[active]]} />
      </div>
    );
  } else if (isVideo) {
    preview = <VideoEditor video={video} setVideo={setVideo} next={next} />;
  } else {
    preview = <div className="preview"></div>;
  }

  let button;
  if (!mediaType) {
    button = <Button className="button btn-effect save" text="저장" disabled />;
  } else if (mediaType === 'image') {
    button = (
      <Button
        className="button btn-effect save"
        text="저장"
        onClick={onClickSaveMedia}
      />
    );
  } else if (mediaType === 'video') {
    button = next ? (
      <>
        <Button
          className="button btn-effect back"
          text="이전"
          onClick={onClickNext}
        />
        <Button
          className="button btn-effect save"
          text="저장"
          onClick={onClickSaveMedia}
        />
      </>
    ) : (
      <Button
        className="button btn-effect save"
        text="다음"
        onClick={onClickNext}
        disabled={creative.processing}
      />
    );
  }

  const [deleteTemp] = useDeleteTempVideoMutation();
  const deleteTempProcess = () => {
    deleteTemp({ filename: video.filename, thumbnails: video.thumbnails });
  };
  useEffect(() => {
    if (mediaType === 'video' && video.full) {
      window.addEventListener('beforeunload', deleteTempProcess);
    }
    return () => {
      if (mediaType === 'image') {
        Object.keys(image).forEach((v) => {
          URL.revokeObjectURL(v);
        });
      } else if (mediaType === 'video' && video.full) {
        deleteTemp({ filename: video.filename, thumbnails: video.thumbnails });
        window.removeEventListener('beforeunload', deleteTempProcess);
      }
    };
  }, [mediaType, video.full]);

  return (
    <>
      <div className="editor ani-fade-in" style={{ padding: '0' }}>
        {isLoading && (
          <div className="loading">
            <FontAwesomeIcon icon={faSpinner} size="2xl" spin />
          </div>
        )}
        <div className="upload">
          <div>
            <label className="label" htmlFor="image">
              이미지
            </label>
            <input
              ref={imageRef}
              id="image"
              className="file"
              type="file"
              accept=".png,.jpg,.jpeg,.gif"
              multiple
              onChange={onChangeImageFile}
            />
          </div>
          <div>
            <label className="label" htmlFor="video">
              동영상
            </label>
            <input
              ref={videoRef}
              id="video"
              className="file"
              type="file"
              accept=".mp4,.mov"
              onChange={onChangeVideoFile}
            />
          </div>
        </div>
        {preview}
        {isImage && (
          <div className="order ani-slide-in-top-bottom">
            {imageArray.map((image, i) => {
              let className = 'image';
              if (active === i) {
                className += ' select';
              }
              return (
                <img
                  key={i}
                  className={className}
                  src={image}
                  alt={image}
                  onClick={() => onChangeActive(i)}
                />
              );
            })}
          </div>
        )}
        {Object.keys(image).length > 1 && (
          <div className="media-control">
            <button
              className="button btn-effect"
              disabled={isFirst}
              onClick={() => onChangeOrder('left')}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <button
              className="button btn-effect"
              disabled={isLast}
              onClick={() => onChangeOrder('right')}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        )}
        <div className="submit" style={{ padding: '0 15px 15px 15px' }}>
          {button}
          <Button
            className="button btn-effect cancle"
            text="취소"
            onClick={onClickCancleMedia}
            disabled={creative.processing}
          />
        </div>
      </div>
    </>
  );
};

export default GetMedia;
