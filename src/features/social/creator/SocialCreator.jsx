import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesRight,
  faCloudArrowUp,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import CreatorHeader from './CreatorHeader';
import GetLocation from './GetLocation';
import CreatorPost from './CreatorPost';
import CreatorTags from './CreatorTags';
import GetContent from './GetContent';
import CreatorMedia from './CreatorMedia';
import GetMedia from './GetMedia';
import {
  useAddSocialMutation,
  useDeleteTempVideoMutation,
} from '../socialApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreator } from '../../login/loginReducer';
import CreatorReaction from './CreatorReaction';
import { closeCreative, processingCreative } from '../socialReducer';

const SocialCreator = ({ creative }) => {
  const dispatch = useDispatch();
  const creator = useSelector(selectCreator);

  const [select, setSelect] = useState('idle');
  const [location, setLocation] = useState('idle');
  const [type, setType] = useState('idle');
  const [media, setMedia] = useState('idle');
  const [post, setPost] = useState('idle');
  const [tags, setTags] = useState('idle');
  const [canSave, setCanSave] = useState(false);

  const onClickSelectLocation = () => {
    if (select === 'content') return;
    setSelect('content');
  };

  const isProcessing = useRef(false);
  const [addSocial, { isLoading }] = useAddSocialMutation();
  const onClickSavePost = async () => {
    isProcessing.current = true;
    dispatch(processingCreative(true));

    const formData = new FormData();
    formData.append('type', 'social');
    formData.append('creator', creator.id);
    formData.append('location', location);
    formData.append('post', post);
    formData.append('tags', tags);
    formData.append('mediaType', type);
    if (type === 'image') {
      for (let i = 0; i < Object.keys(media).length; i++) {
        formData.append('media', media[i]);
      }
    } else if (type === 'video') {
      formData.append('video', media.video);
      formData.append('thumbnail', media.thumbnail);
    }

    try {
      await addSocial(formData).unwrap();
      dispatch(closeCreative());
      dispatch(processingCreative(false));
    } catch (error) {
      console.error(error);
    }
  };

  const onClickCloseCreative = () => dispatch(closeCreative());

  let style;
  if (select === 'location') {
    style = {
      alignItems: 'flex-start',
    };
  }
  if (select === 'media') {
    style = {
      alignItems: 'center',
    };
  }
  if (select === 'content') {
    style = {
      alignItems: 'flex-end',
    };
  }
  if (select === 'idle' && canSave) {
    style = {
      marginLeft: '0',
    };
  }

  useEffect(() => {
    if (
      location !== 'idle' &&
      media !== 'idle' &&
      post !== 'idle' &&
      tags !== 'idle'
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [location, media, post, tags]);

  const [deleteTemp] = useDeleteTempVideoMutation();
  const deleteTempProcess = () => {
    if (type === 'video' && !isProcessing.current) {
      deleteTemp({
        creator: media.author,
        filename: media.video,
        thumbnails: [media.thumbnail],
      });
    }
  };
  useEffect(() => {
    if (type === 'video' && !isProcessing.current) {
      window.addEventListener('beforeunload', deleteTempProcess);
    }
    return () => {
      if (type === 'image') {
        Object.keys(media).forEach((m) => URL.revokeObjectURL(media[m]));
      }
      if (type === 'video') {
        if (!isProcessing.current) {
          deleteTempProcess();
          window.removeEventListener('beforeunload', deleteTempProcess);
        }
      }
    };
  }, [type, media]);

  return (
    <>
      <div className="social-creator ani-fade-in">
        <div className="creator-preview" style={style}>
          {select === 'idle' && (
            <article
              className="social-content"
              style={{
                boxShadow: '0 0 15px rgba(255,255,255,0.75)',
              }}
            >
              {isLoading && (
                <div className="create-loading">
                  <FontAwesomeIcon icon={faSpinner} size="2xl" spin />
                </div>
              )}
              {select === 'idle' && canSave && (
                <>
                  <div className="create-post ani-slide-in-left-right">
                    <button
                      className="button btn-effect"
                      onClick={onClickSavePost}
                    >
                      <FontAwesomeIcon icon={faCloudArrowUp} />
                      <div className="balloon-container ani-fade-in">
                        <div className="balloon">Post!</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
              <CreatorHeader
                select={select}
                setSelect={setSelect}
                location={location}
              />
              <CreatorMedia
                select={select}
                setSelect={setSelect}
                type={type}
                media={media}
              />
              <div
                className={`content ${
                  post === 'idle' && select !== 'content' ? 'create-mode' : ''
                }`}
                onClick={onClickSelectLocation}
              >
                <CreatorReaction />
                <CreatorPost post={post} />
                <CreatorTags tags={tags} />
              </div>
            </article>
          )}
          {select !== 'idle' && (
            <div className="creator-editor" style={style}>
              {select === 'location' && (
                <GetLocation
                  setSelect={setSelect}
                  location={location}
                  setLocation={setLocation}
                />
              )}
              {select === 'media' && (
                <GetMedia
                  setSelect={setSelect}
                  type={type}
                  setType={setType}
                  media={media}
                  setMedia={setMedia}
                  creative={creative}
                />
              )}
              {select === 'content' && (
                <GetContent
                  post={post}
                  setPost={setPost}
                  tags={tags}
                  setTags={setTags}
                  setSelect={setSelect}
                />
              )}
            </div>
          )}
          <button
            className="close button btn-effect"
            onClick={onClickCloseCreative}
            disabled={creative.processing}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialCreator;
