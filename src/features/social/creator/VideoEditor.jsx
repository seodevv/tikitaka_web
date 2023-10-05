import {
  faArrowRotateRight,
  faPause,
  faPlay,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoEditor = ({ video, setVideo, next }) => {
  const player = useRef(null);
  const [offset, setOffset] = useState({ width: '360px', height: '450px' });
  const [status, setStatus] = useState('ready');
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [played, setPlayed] = useState(0);

  const onPlay = () => setStatus('playing');
  const onProgress = (e) => {
    if (e.played >= video.endTime) {
      onEnded();
      setPlayed(video.endTime);
      return;
    }

    if (playing) {
      const playedSeconds = e.playedSeconds;
      if (video.startTime) {
        const calculate = playedSeconds - video.duration * video.startTime;
        setPlayedSeconds(calculate < 0 ? 0 : calculate);
      } else {
        setPlayedSeconds(playedSeconds);
      }
      setPlayed(parseFloat(e.played));
    }
  };
  const onPause = () => {
    if (played === video.endTime) return;
    setPlaying(false);
    setStatus('paused');
  };
  const onEnded = () => {
    setPlaying(false);
    setStatus('ended');
    setPlayedSeconds(video.totalTime);
  };

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickTogglePlaying = (e) => {
    preventEvent(e);
    if (status === 'ended') {
      onClickEnded();
    }
    setPlaying((prev) => !prev);
  };
  const onClickPlaying = (e) => {
    preventEvent(e);
    setPlaying(true);
  };

  const onClickEnded = () => {
    player.current.seekTo(video.startTime);
  };

  let button;
  switch (status) {
    case 'ready':
      button = (
        <button
          className="onPlay button btn-effect"
          onClick={(e) => onClickPlaying(e)}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
      );
      break;
    case 'paused':
      button = (
        <button className="onPause button btn-effect">
          <FontAwesomeIcon icon={faPause} />
        </button>
      );
      break;
    case 'ended':
      button = (
        <button className="onPause button btn-effect" onClick={onClickEnded}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </button>
      );
      break;
  }

  let input;
  const prevPlaying = useRef();
  input = (
    <input
      className="input"
      type="range"
      min={0}
      max={0.999999}
      step="any"
      value={played}
      onMouseDown={(e) => {
        prevPlaying.current = playing;
        setPlaying(false);
      }}
      onMouseUp={(e) => {
        if (e.target.value < video.startTime) {
          player.current.seekTo(video.startTime);
          setPlayed(video.startTime);
          setPlaying(prevPlaying.current);
          setPlayedSeconds(0);
          return;
        }
        if (e.target.value > video.endTime) {
          player.current.seekTo(video.endTime);
          setPlayed(video.endTime);
          setPlaying(false);
          setStatus('ended');
          setPlayedSeconds(video.totalTime);
          return;
        }
        if (player.current) {
          player.current.seekTo(parseFloat(e.target.value));
          setPlaying(prevPlaying.current);
          setPlayedSeconds((e.target.value - video.startTime) * video.duration);
        }
      }}
      onChange={(e) => setPlayed(parseFloat(e.target.value))}
    />
  );

  let thumbnail;
  if (video.thumbnails) {
    const length = video.thumbnails.length - 1;
    const targets = [
      video.thumbnails[0],
      video.thumbnails[parseInt(length * 0.25)],
      video.thumbnails[parseInt(length * 0.5)],
      video.thumbnails[parseInt(length * 0.75)],
      video.thumbnails[length],
    ];
    thumbnail = (
      <div className="thumbnail">
        {targets.map((v) => {
          const src = `${process.env.SERVER_URL}/${video.path}/${v}`;
          return <img key={v} src={src} alt={v} draggable="false" />;
        })}
      </div>
    );
  }

  let loading;
  if (video.isLoading) {
    loading = (
      <div className="loading">
        <FontAwesomeIcon icon={faSpinner} size="2xl" spin />
      </div>
    );
  }

  const rangeRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const flag = useRef('');
  const maxX = useRef(0);
  const currentLeft = useRef(0);
  const currentRight = useRef(0);
  const startX = useRef(null);
  const tempX = useRef(null);
  const playedHandler = (type) => {
    switch (type) {
      case 'left': {
        const value = tempX.current / (parseInt(offset.width) - 10);
        setVideo((prev) => ({ ...prev, startTime: value }));
        if (played < value) {
          player.current.seekTo(value);
          setPlayed(value);
        }
        const calculate = (played - value) * video.duration;
        setPlayedSeconds(calculate < 0 ? 0 : calculate);
        break;
      }
      case 'right': {
        const value = 1 + tempX.current / (parseInt(offset.width) - 10);
        setVideo((prev) => ({ ...prev, endTime: value }));
        if (played > value) {
          player.current.seekTo(value);
          setPlayed(value);
        }
        break;
      }
    }
  };
  const onMouseDown = (e) => {
    if (!rangeRef.current || !leftRef.current || !rightRef.current) return;

    if (e.target === leftRef.current) {
      flag.current = 'left';
    } else if (e.target === rightRef.current) {
      flag.current = 'right';
    }
    startX.current = e.clientX;
  };
  const onMouseMove = (e) => {
    if (!maxX.current) {
      maxX.current = rangeRef.current.offsetWidth - 30;
    }
    switch (flag.current) {
      case 'left': {
        tempX.current = currentLeft.current - (startX.current - e.clientX);
        if (tempX.current <= 0) {
          tempX.current = 0;
        } else if (tempX.current - currentRight.current > maxX.current) {
          tempX.current = maxX.current + currentRight.current;
        }
        leftRef.current.style.left = `${tempX.current}px`;
        rangeRef.current.style.left = `${tempX.current}px`;
        rangeRef.current.style.width = `calc(100% - ${
          10 + tempX.current - currentRight.current
        }px)`;
        playedHandler('left');
        break;
      }
      case 'right': {
        tempX.current = currentRight.current - (startX.current - e.clientX);
        if (tempX.current >= 0) {
          tempX.current = 0;
        } else if (currentLeft.current - tempX.current > maxX.current) {
          tempX.current = currentLeft.current - maxX.current;
        }
        rightRef.current.style.left = `${
          parseInt(offset.width) - 10 + tempX.current
        }px`;
        rangeRef.current.style.width = `calc(100% - ${
          10 - tempX.current + currentLeft.current
        }px`;
        playedHandler('right');
        break;
      }
    }
  };
  const onMouseFinished = () => {
    switch (flag.current) {
      case 'left':
        currentLeft.current = tempX.current;
        break;
      case 'right':
        currentRight.current = tempX.current;
        break;
    }
    flag.current = '';
  };

  let thumbnail_selector;
  let style = {
    transition: '.3s all ease-in',
  };
  const selectRef = useRef(null);
  const onClickSelectThumbnail = (index) =>
    setVideo((prev) => ({ ...prev, thumbnail: index }));
  const onWheelThumbnails = (e) => {
    if (!selectRef.current) return;
    if (e.deltaY > 0) {
      selectRef.current.scrollLeft = selectRef.current.scrollLeft + 50;
    } else {
      selectRef.current.scrollLeft = selectRef.current.scrollLeft - 50;
    }
  };
  if (next) {
    const src = `${process.env.SERVER_URL}/temp/${
      video.thumbnails[video.thumbnail]
    }`;
    style.transform = `translateX(-${offset.width})`;
    thumbnail_selector = (
      <div className="thumbnail-select">
        <div className="media">
          <img className="image" src={src} />
        </div>
        <div className="thumbnail-info">썸네일을 선택해주세요.</div>
        <div ref={selectRef} className="selector" onWheel={onWheelThumbnails}>
          {video.thumbnails.map((thumbnail, i) => {
            const style =
              video.thumbnail === i ? { filter: 'brightness(0.5)' } : {};
            return (
              <img
                key={thumbnail}
                className="image"
                style={style}
                src={`${process.env.SERVER_URL}/temp/${thumbnail}`}
                onClick={() => onClickSelectThumbnail(i)}
                draggable="false"
              />
            );
          })}
        </div>
      </div>
    );
  }

  useEffect(() => {
    setVideo((prev) => ({
      ...prev,
      totalTime: (video.endTime - video.startTime) * video.duration,
    }));
  }, [video.startTime, video.endTime]);

  useEffect(() => {
    if (next) {
      setPlaying(false);
    }
  }, [next]);

  useEffect(() => {
    if (window.innerWidth < 800) {
      setOffset({ width: '300px', height: '375px' });
    }
    const listener = (e) => {
      const innerWidth = e.target.innerWidth;
      if (innerWidth < 800) {
        setOffset({ width: '300px', height: '375px' });
      } else {
        setOffset({ width: '360px', height: '450px' });
      }
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return (
    <section className="p-relative" style={style}>
      <div className="preview" onClick={(e) => onClickTogglePlaying(e)}>
        <ReactPlayer
          ref={player}
          url={video.full}
          width={offset.width}
          height={offset.height}
          playing={playing}
          progressInterval={100}
          onPlay={onPlay}
          onPause={onPause}
          onProgress={onProgress}
          onEnded={onEnded}
        />
        {button}
      </div>
      <div className="duration">
        <span>{Math.floor(playedSeconds * 10) / 10}</span>
        <span> / </span>
        <span style={{ color: '#a0a0a0' }}>
          {video.totalTime ? Math.floor(video.totalTime * 10) / 10 : 0} s
        </span>
      </div>
      <div className="progress order ani-slide-in-top-bottom">
        {thumbnail}
        <div ref={rangeRef} className="range"></div>
        {input}
        <button
          ref={leftRef}
          className="controller left btn-effect"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseFinished}
          onMouseLeave={onMouseFinished}
        ></button>
        <button
          ref={rightRef}
          className="controller right btn-effect"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseFinished}
          onMouseLeave={onMouseFinished}
        ></button>
      </div>
      {loading}
      {thumbnail_selector}
    </section>
  );
};

export default VideoEditor;
