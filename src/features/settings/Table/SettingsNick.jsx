import { useEffect, useRef, useState } from 'react';
import { useGetNickDuplicatedMutation } from '../SettingsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';

const SettingsNick = ({ userInfo, status, setStatus }) => {
  const [nick, setNick] = useState('');
  const [nickMessage, setNickMessage] = useState('');
  const nickTimer = useRef(null);
  const [nickDuplicated, setNickDuplicated] = useState('idle');

  const [getNickDuplicated, { isLoading }] = useGetNickDuplicatedMutation();
  const onChangeNick = (e) => {
    setNick(e.target.value);
    setNickDuplicated('idle');

    if (nickTimer.current) clearInterval(nickTimer.current);
    if (status === e.target.value) return;

    if (e.target.value.length < 2) {
      setNickMessage('닉네음은 최소 2글자입니다.');
      setStatus('block');
      return;
    } else if (e.target.value.length > 12) {
      setStatus('block');
      setNickMessage('닉네임은 최대 12글자입니다.');
      return;
    } else {
      setNickMessage('');
    }

    if (e.target.value.length === 0) return;

    const regex = /^(?:[a-zA-Z가-힣1-9\-_\.]+)(?:\s[a-zA-Z가-힣1-9\-_\.]+)?$/;
    if (!regex.test(e.target.value)) {
      setNickMessage('한글(단모음x), 영문, 숫자 조합만 가능합니다.');
      setStatus('block');
      return;
    }

    if (e.target.value && e.target.value !== userInfo.nick) {
      setNickDuplicated('processing');
      nickTimer.current = setTimeout(async () => {
        try {
          const { duplicated } = await getNickDuplicated({
            nick: e.target.value,
          }).unwrap();
          if (duplicated) {
            setNickMessage('닉네임이 중복됩니다.');
            setNickDuplicated('duplicated');
            return;
          }
          if (e.target.value.length < 2 || e.target.value.length > 12) {
            setNickDuplicated('idle');
            setStatus('block');
          } else if (!regex.test(e.target.value)) {
            setNickDuplicated('idle');
            setStatus('block');
          } else {
            setNickDuplicated('success');
            setStatus(e.target.value);
          }
        } catch (error) {
          console.error(error);
        }
      }, 300);
    } else {
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (status === 'reset') {
      setNick(userInfo.nick);
      setStatus('idle');
      setNickDuplicated('idle');
      setNickMessage('');
    }
  }, [status]);

  useEffect(() => {
    if (userInfo.nick) {
      setNick(userInfo.nick);
    }
  }, [userInfo]);

  return (
    <>
      <tr className={`${nickMessage ? 'nick-message-container' : ''}`}>
        <td>nickname</td>
        <td className="p-relative">
          <input type="text" value={nick} onChange={onChangeNick} />
          {nickMessage && <div className="nick-message">{nickMessage}</div>}
          <div className="settings-email-auth d-inline">
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} size="xl" spin />
            ) : nickDuplicated === 'duplicated' ? (
              <FontAwesomeIcon icon={faXmark} size="xl" color="#e23131" />
            ) : (
              nickDuplicated === 'success' && (
                <FontAwesomeIcon icon={faCheck} size="xl" color="#278839" />
              )
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default SettingsNick;
