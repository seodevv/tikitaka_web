import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoPlayer from '../article/VideoPlayer';
import {
  useGetReactionQuery,
  useGetSocialQuery,
  useToggleReactionMutation,
} from '../socialApiSlice';
import {
  faChevronLeft,
  faChevronRight,
  faEllipsisVertical,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeArticle,
  selectModal,
  showArticle,
  showModal,
} from '../socialReducer';
import ImageSlide from '../../../components/ImageSlide';
import { useEffect, useRef, useState } from 'react';
import Profile from '../../../components/Profile';
import Ago from '../../../components/Ago';
import Tag from '../../../components/Tag';
import { selectCreatorId } from '../../login/loginReducer';
import DetailReaction from './DetailReaction';
import DetailComments from './DetailComments';
import DetailInput from './DetailInput';
import { getKoreaDate } from '../../../app/common';
import DetailEditor from './DetailEditor';

const SocialDetail = ({ socialId, socialIds }) => {
  const userId = useSelector(selectCreatorId);
  const modal = useSelector(selectModal);
  const dispatch = useDispatch();

  const [owner, setOwner] = useState(false);
  const [focus, setFocus] = useState(false);
  const [prev, setPrev] = useState('idle');
  const [next, setNext] = useState('idle');
  const scrollRef = useRef(null);
  const {
    data: social = {
      userType: 'App',
      profile: 'profile.png',
      nick: 'unknown',
      modified: getKoreaDate(new Date()).toISOString(),
    },
    isSuccess,
    isFetching,
  } = useGetSocialQuery({ socialId });

  const { data: reactions = { like: false, bookmark: false } } =
    useGetReactionQuery({
      socialId,
      userId,
    });

  const onClickCloseSocialDetail = () => dispatch(closeArticle());
  const onCommentsScrollBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const [toggleReaction] = useToggleReactionMutation();
  const onClickReactionToggle = async (type) => {
    try {
      await toggleReaction({
        type,
        socialId,
        userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  let media;
  let content;
  let tags;
  if (isSuccess & !isFetching) {
    if (social.type === 'image') {
      const mediaArray = social.media.split('/');
      media = (
        <div className="images scroll-none">
          <ImageSlide
            author={social.userId}
            mediaArray={mediaArray}
            width="100%"
            like={reactions.like}
            setLike={onClickReactionToggle}
          />
        </div>
      );
    } else if (social.type === 'video') {
      media = (
        <VideoPlayer
          author={social.userId}
          thumbnail={social.thumbnail}
          media={social.media}
          width="100%"
          height="100%"
        />
      );
    }

    const splitContent = social.content.split(/\r\n|\r|\n/);
    content = splitContent.map((v, i) => {
      const isHangle = /[가-힣]/.test(v) ? 'hangle ' : '';
      if (splitContent.length - 1 === i) {
        return (
          <span key={i} className={isHangle}>
            {v}
          </span>
        );
      }
      return (
        <span key={i} className={isHangle}>
          {v}
          <br />
        </span>
      );
    });

    const splitTags = social.tags.split(',');
    tags = splitTags.map((tag, i) => {
      const isHangle = /[가-힣]/.test(tag) ? 'hangle' : 'hangle';
      if (tag === '') return;
      return (
        <Tag key={i} className={isHangle}>
          {tag}
        </Tag>
      );
    });
  }

  const closeModal = (e) => {
    if (modal.flag) {
      return;
    }
    if (e.keyCode === 27) {
      dispatch(closeArticle());
    } else if (e.keyCode === 37 && prev !== 'idle') {
      dispatch(showArticle({ id: prev, ids: socialIds }));
    } else if (e.keyCode === 39 && next !== 'idle') {
      dispatch(showArticle({ id: next, ids: socialIds }));
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, [modal, prev, next]);

  useEffect(() => {
    if (userId === social.userId) {
      setOwner(true);
    }
  }, [userId, social]);

  useEffect(() => {
    if (socialIds.length > 1) {
      const current = socialIds.findIndex((v) => v === socialId);
      if (current === 0) {
        setPrev('idle');
        setNext(socialIds[current + 1]);
      } else if (current === socialIds.length - 1) {
        setPrev(socialIds[current - 1]);
        setNext('idle');
      } else {
        setPrev(socialIds[current - 1]);
        setNext(socialIds[current + 1]);
      }
    }
  }, [socialId, socialIds]);

  return (
    <>
      <div className="social-detail ani-fade-in">
        <div className="detail-media">{media}</div>
        <div className="detail-info">
          <div className="info">
            <Profile type={social.userType} profile={social.profile} />
            <div className="nick">
              <p className={`${/[가-힣]/.test(social.nick) ? 'hangle' : ''}`}>
                {social.nick}
              </p>
              <Ago className="time" date={social.modified} />
            </div>
            {owner && !modal.edit && (
              <div className="option">
                <FontAwesomeIcon
                  className="button btn-effect transit-none"
                  icon={faEllipsisVertical}
                  onClick={() => {
                    dispatch(
                      showModal({
                        id: socialId,
                        type: 'detail',
                        userId: social.userId,
                      })
                    );
                  }}
                />
              </div>
            )}
          </div>
          {!modal.edit ? (
            <>
              <div className="content">{content}</div>
              <div className="tags">{tags}</div>
              <div className="comments scroll-none" ref={scrollRef}>
                <DetailComments author={social.userId} socialId={socialId} />
              </div>
              <DetailReaction
                socialId={socialId}
                like={reactions.like}
                bookmark={reactions.bookmark}
                setFocus={setFocus}
                setReactions={onClickReactionToggle}
              />
              <DetailInput
                author={social.userId}
                userId={userId}
                socialId={socialId}
                focus={focus}
                onScrollBottom={onCommentsScrollBottom}
              />
            </>
          ) : (
            <>
              <DetailEditor
                socialId={socialId}
                content={social.content}
                tags={social.tags}
              />
            </>
          )}
        </div>
        <FontAwesomeIcon
          className="close btn-effect"
          icon={faXmark}
          size="2xl"
          color="#fff"
          onClick={onClickCloseSocialDetail}
        />
        {prev !== 'idle' && (
          <FontAwesomeIcon
            className="prev btn-effect transit-none"
            icon={faChevronLeft}
            size="2xl"
            color="#fff"
            onClick={() => dispatch(showArticle({ id: prev, ids: socialIds }))}
          />
        )}
        {next !== 'idle' && (
          <FontAwesomeIcon
            className="next btn-effect transit-none"
            icon={faChevronRight}
            size="2xl"
            color="#fff"
            onClick={() => dispatch(showArticle({ id: next, ids: socialIds }))}
          />
        )}
      </div>
    </>
  );
};

export default SocialDetail;
