import Button from '../../../components/Button';
import { useUpdateChatPinedMutation } from '../chatApiSlice';
import Profile from '../../../components/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faEllipsis,
  faQuoteLeft,
  faQuoteRight,
  faThumbTack,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistance, parseISO } from 'date-fns';
import { getKoreaDate } from '../../../app/common';
import { useSelector } from 'react-redux';
import { selectTypingById } from '../chatReducer';

const ChatDetailInfo = ({
  chatId,
  setChatId,
  chat,
  isSuccess,
  creator,
  setConfirm,
}) => {
  const typing = useSelector((state) => selectTypingById(state, chatId));

  const [updateChatPined] = useUpdateChatPinedMutation();
  const onClickPined = async () => {
    try {
      await updateChatPined({ chatId, creator }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };
  const onClickDeleted = () => setConfirm(true);
  const onClickClose = () => setChatId('');

  let profile;
  let userName;
  let button;
  let ago;
  if (isSuccess && chat) {
    ago =
      formatDistance(parseISO(chat.messageDate), getKoreaDate(new Date())) +
      ' ago';
    profile = (
      <Profile
        className="profile"
        type={chat.userType}
        profile={chat.profile}
      />
    );
    userName = <h3>{chat.nick}</h3>;
    button = (
      <>
        <Button
          className="bg-transparent bd-none"
          icon={faThumbTack}
          size="lg"
          color={chat.pined ? '#000000' : '#aaaaaa'}
          onClick={onClickPined}
        />
        <Button
          className="bg-transparent bd-none btn-effect"
          icon={faTrash}
          size="lg"
          color="#aaaaaa"
          onClick={onClickDeleted}
        />
      </>
    );
  }

  return (
    <div className="chat-detail-info flex-row-no flex-align-center">
      <button className="close btn-effect" onClick={onClickClose}>
        <FontAwesomeIcon icon={faChevronLeft} size="xl" color="#001c40" />
      </button>
      {profile}
      <div>
        {userName}
        {typing ? (
          <p>
            <FontAwesomeIcon icon={faQuoteLeft} />
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEllipsis} beatFade size="xl" />
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faQuoteRight} />
          </p>
        ) : (
          <p className="ago">{ago}</p>
        )}
      </div>
      <div className="flex-grow"></div>
      <div className="detail-info-buttons">{button}</div>
    </div>
  );
};

export default ChatDetailInfo;
