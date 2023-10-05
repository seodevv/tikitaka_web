import { useNavigate } from 'react-router-dom';
import Ago from '../../components/Ago';
import Profile from '../../components/Profile';
import { useDispatch } from 'react-redux';
import { showArticle } from '../social/socialReducer';

const AlarmPost = ({ type, source, social, created }) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  let message;
  let image;
  const src =
    social.type === 'image'
      ? `${process.env.SERVER_URL}/img/social/${social.creator}/${
          social.media.split('/')[0]
        }`
      : `${process.env.SERVER_URL}/video/social/${social.creator}/${social.thumbnail}`;

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickProfile = (e, id) => {
    preventEvent(e);
    navigator(`/feed/${id}`);
  };
  const onClickShowPost = () => {
    dispatch(showArticle({ id: social.id }));
  };

  switch (type) {
    case 'like':
      message = <span>{source.nick}님이 회원님의 포스트를 좋아합니다.</span>;
      image = <img src={src} alt="image" />;
      break;
    case 'reply':
      message = (
        <span>{source.nick}님이 회원님의 포스트에 댓글을 남겼습니다.</span>
      );
      image = <img src={src} alt="thumbnail" />;
      break;
    default:
      message = '';
      image = '';
  }
  return (
    <>
      <div className="alarm-item" onClick={onClickShowPost}>
        <Profile
          className="profile exclude"
          type={source.type}
          profile={source.profile}
          onClick={(e) => onClickProfile(e, source.id)}
        />
        <div className="message">
          {message}
          <Ago className="time" date={created} />
        </div>
        <div className="post">{image}</div>
      </div>
    </>
  );
};

export default AlarmPost;
