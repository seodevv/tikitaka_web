import React, { useEffect, useLayoutEffect, useState } from 'react';
import ChatDetailInfo from './ChatDetailInfo';
import ChatDetailStream from './ChatDetailStream';
import {
  useDisableChatMutation,
  useGetChatQuery,
  useUpdateChatMessageUnReadMutation,
} from '../chatApiSlice';
import { useSelector } from 'react-redux';
import { selectCreator } from '../../login/loginReducer';

const ChatDetail = ({ chatId, setChatId }) => {
  const userInfo = useSelector(selectCreator);
  const creator = userInfo && parseInt(userInfo.id);

  const { data: chat, isSuccess } = useGetChatQuery(
    { chatId, creator },
    {
      pollingInterval: 60000,
    }
  );
  const [target, setTarget] = useState('');

  useEffect(() => {
    if (chat) {
      setTarget(chat.userId);
    }
  }, [chat]);

  const [updateUnRead] = useUpdateChatMessageUnReadMutation();
  useLayoutEffect(() => {
    const fetchChatUnRead = async () => {
      try {
        await updateUnRead({ chatId, creator }).unwrap();
      } catch (error) {
        console.error(error);
      }
    };
    fetchChatUnRead();
  }, [chatId]);

  const [confirm, setConfirm] = useState(false);
  const [disableChat] = useDisableChatMutation();
  const onClickConfirm = async () => {
    try {
      setChatId('');
      await disableChat({ chatId, creator }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };
  const onClickClose = () => setConfirm(false);

  return (
    <section className="chat-detail-box p-relative ani-fade-in">
      {confirm && (
        <div className="chat-detail-confirm">
          <div className="confirm-box">
            <h4>정말 삭제하시겠습니까?</h4>
            <button className="button btn-effect" onClick={onClickConfirm}>
              확인
            </button>
            <button className="button btn-effect" onClick={onClickClose}>
              취소
            </button>
          </div>
        </div>
      )}
      <ChatDetailInfo
        chatId={chatId}
        setChatId={setChatId}
        chat={chat}
        isSuccess={isSuccess}
        creator={creator}
        setConfirm={setConfirm}
      />
      <ChatDetailStream chatId={chatId} creator={creator} target={target} />
    </section>
  );
};

export default ChatDetail;
