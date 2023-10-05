import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import OpenGraph from './OpenGraph';
import Youtube from 'react-youtube';

const Message = ({ chatId, data, setEnlarge, scrollRef, prevScrollTop }) => {
  const { id, type, message } = data;

  const href_regex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  if (type === 'href') {
    const href_url = message.match(href_regex)[0];
    const hasProtocol = href_url.search(/^http/) !== -1;
    const index = message.indexOf(href_url);
    return (
      <>
        <div id={id} className="message-box">
          <span className="message d-inlineblock break-all text-start">
            {message.substring(0, index)}
            <a
              className="message-href"
              href={hasProtocol ? href_url : `//${href_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {href_url}
            </a>
            {message.substring(index + href_url.length)}
          </span>
        </div>
        <OpenGraph
          href_url={href_url}
          scrollRef={scrollRef}
          prevScrollTop={prevScrollTop}
        />
      </>
    );
  }

  if (type === 'youtube') {
    const regex =
      /(?:http:|https:)?(?:\/\/)?(?:www\.)?(?:youtube.com|youtu.be)\/(?:watch|embed|shorts)?(?:\?v=|\/)?(\S+)?/;
    const match = message.match(regex)[1];
    const videoId =
      match.search('&') === -1 ? match : match.substring(0, match.search('&'));
    // console.log(videoId);
    return (
      <div className="message-box">
        <span className="message d-block break-all text-start">
          <Youtube
            className="youtube-container"
            videoId={videoId}
            opts={{
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
          />
        </span>
      </div>
    );
  }

  if (type === 'image') {
    const imageUrl = `${process.env.SERVER_URL}/img/chat/${chatId}/${message}`;
    const onClickImage = () => {
      setEnlarge(message);
    };
    const download = imageUrl.substring(imageUrl.search(/\d{13}_/) + 14);
    return (
      <div id={id} className="message-box">
        <span
          className="message d-inlineblock break-all text-start p-relative"
          onClick={onClickImage}
        >
          <img className="image" src={imageUrl} alt={imageUrl} />
          <a
            className="download btn-effect"
            href={imageUrl}
            download={download}
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faDownload} size="xl" />
          </a>
        </span>
      </div>
    );
  }

  return (
    <div id={id} className="message-box">
      <span className="message d-inlineblock break-all text-start">
        {message}
      </span>
    </div>
  );
};

export default Message;
