import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateRight,
  faExpand,
  faPause,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';

const VideoPlayer = ({ author, thumbnail, media, width, height }) => {
  const player = useRef(null);
  const [status, setStatus] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [pip, setPip] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  const onPlay = () => {
    setPaused(false);
  };
  const onPause = () => setPaused(true);
  const onProgress = (e) => {
    const { playedSeconds, played, loadedSeconds, loaded } = e;
    setSeconds(playedSeconds.toFixed(1));
    setProgress(played);
  };
  const onEnded = () => {
    setPlaying(false);
    setEnded(true);
  };
  const onClickPreview = () => setStatus(true);

  const onClickTogglePlay = (e) => {
    if (ended) return;
    if (paused) setPaused(false);
    setPlaying((prev) => !prev);
  };
  const onClickTogglePip = (e) => {
    preventEvent(e);
    setPip((prev) => !prev);
  };
  const onClickRestart = (e) => {
    preventEvent(e);
    setPlaying(true);
    setEnded(false);
    setPaused(false);
  };
  const onClickToggleMuted = (e) => {
    preventEvent(e);
    setMuted((prev) => !prev);
  };
  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const litener = (e) => {
      if (e.keyCode === 27) setPip(false);
    };
    if (pip) {
      window.addEventListener('keydown', litener);
    }
    return () => {
      window.removeEventListener('keydown', litener);
    };
  }, [pip]);

  return (
    <>
      <div className="video" onClick={onClickTogglePlay}>
        <ReactPlayer
          ref={player}
          url={`${process.env.SERVER_URL}/video/social/${author}/${media}`}
          width={width}
          height={height}
          style={{ background: '#000' }}
          playing={playing}
          loop={true}
          muted={muted}
          pip={pip}
          progressInterval={100}
          onPlay={onPlay}
          onPause={onPause}
          onProgress={onProgress}
          onEnded={onEnded}
          onClickPreview={onClickPreview}
          light={
            <img
              className="thumbnail"
              src={`${process.env.SERVER_URL}/video/social/${author}/${thumbnail}`}
              alt={thumbnail}
              width="100%"
            />
          }
        />
        {status && (
          <>
            <div className="seconds ani-fade-in">{seconds}s</div>
            <button
              className="button btn-effect pip ani-fade-in"
              onClick={onClickTogglePip}
            >
              <FontAwesomeIcon icon={faExpand} />
            </button>
          </>
        )}
        {(ended || paused) && (
          <button
            className="button btn-effect ended ani-fade-in"
            onClick={onClickRestart}
          >
            <FontAwesomeIcon icon={ended ? faArrowRotateRight : faPause} />
          </button>
        )}
        <button
          className="button btn-effect volume"
          onClick={onClickToggleMuted}
        >
          <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} />
        </button>
        {status && (
          <div className="progress">
            <div className="bar" style={{ width: `${progress * 100}%` }}></div>
            <input
              className="input"
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={progress}
              onClick={(e) => preventEvent(e)}
              onMouseDown={() => setPlaying(false)}
              onMouseUp={(e) => {
                if (player.current) {
                  setPlaying(true);
                  player.current.seekTo(parseFloat(e.currentTarget.value));
                }
              }}
              onChange={(e) => setProgress(e.currentTarget.value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
