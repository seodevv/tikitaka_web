import { memo, useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import ImageSlide from '../../../components/ImageSlide';

const ArticleMedia = memo(
  ({ author, type, thumbnail, media, like, setLike }) => {
    const [mediaArray, setMediaArray] = useState(media.split('/'));
    const [offset, setOffset] = useState({ width: '360px', height: '450px' });

    let content;
    if (type === 'image') {
      content = (
        <ImageSlide
          author={author}
          mediaArray={mediaArray}
          like={like}
          setLike={setLike}
          width={offset.width}
        />
      );
    }

    if (type === 'video') {
      content = (
        <VideoPlayer
          author={author}
          thumbnail={thumbnail}
          media={media}
          width={offset.width}
          height={offset.height}
        />
      );
    }

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
      <>
        <div className="media">{content}</div>
      </>
    );
  }
);

export default ArticleMedia;
