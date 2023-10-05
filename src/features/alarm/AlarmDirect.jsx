import { useNavigate } from 'react-router-dom';
import Ago from '../../components/Ago';
import Profile from '../../components/Profile';
import {
  useGetFeedsIsFollowQuery,
  usePostFeedsToggleFollowMutation,
} from '../feed/feedApiSlice';
import { useDispatch } from 'react-redux';
import { showMessage } from '../social/socialReducer';

const AlarmDirect = ({ creatorId, chatId, type, source, created }) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const { data: isFollow, isSuccess } = useGetFeedsIsFollowQuery(
    { userId: creatorId, target: source.id },
    { skip: type === 'chat' ? true : false }
  );

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onClickMoveFeed = (e) => {
    preventEvent(e);
    navigator(`/feed/${source.id}`);
  };
  const [follow] = usePostFeedsToggleFollowMutation();
  const onClickFollow = async (e) => {
    preventEvent(e);
    try {
      await follow({ userId: creatorId, target: source.id });
    } catch (error) {
      console.error(error);
      dispatch(showMessage('Server error, try again'));
    }
  };

  const onClickReply = async (e) => {
    preventEvent(e);
    navigator(`/chat?chatId=${chatId}`);
  };

  let message;
  let classname = 'exclude';
  let button;
  switch (type) {
    case 'follow':
      message = <span>{source.nick}님이 회원님을 팔로우했습니다.</span>;
      classname += ' follow';
      button = isSuccess && !isFollow.result && (
        <button onClick={onClickFollow}>Follow</button>
      );
      break;
    case 'chat':
      message = <span>{source.nick}님이 회원님에게 메시지를 보냈습니다.</span>;
      classname += ' reply';
      button = <button onClick={onClickReply}>reply</button>;
      break;
  }

  return (
    <>
      <div className="alarm-item" onClick={onClickMoveFeed}>
        <Profile
          className="profile"
          type={source.type}
          profile={source.profile}
        />
        <div className="message">
          {message}
          <Ago className="time" date={created} />
        </div>
        <div className={classname}>{button}</div>
      </div>
    </>
  );
};

export default AlarmDirect;
