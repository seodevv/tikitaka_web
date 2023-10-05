import React, { useEffect, useState } from 'react';
import { faThumbtack, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chat from './Chat';
import {
  useGetChatListQuery,
  useUpdateChatMessageUnReadMutation,
} from '../chatApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  RECEIVE_MESSAGE_FORM_TARGET,
  RECEIVE_TYPING_FROM_TARGET,
  selectWebSocket,
} from '../../websocket/webSocketSlice';
import {
  updateChatMessageQueryData,
  updateUnreadCountQueryData,
} from '../../../app/store';
import { addTypings, removeTypings, selectTypings } from '../chatReducer';
import { selectCreatorId } from '../../login/loginReducer';

const ChatList = ({ active, setActive }) => {
  const creator = useSelector(selectCreatorId);
  const {
    data: chatList,
    isSuccess,
    refetch,
  } = useGetChatListQuery({ creator }, { skip: creator ? false : true });

  const typings = useSelector(selectTypings);

  let pined = [];
  let allChat = [];
  const [contextMenu, setContextMenu] = useState('');
  if (isSuccess) {
    chatList.forEach((chat) => {
      const typing =
        typings.findIndex((v) => v === chat.id) !== -1 ? true : false;
      if (chat.pined) {
        pined.push(
          <Chat
            key={chat.id}
            chat={chat}
            creator={creator}
            active={active}
            setActive={setActive}
            typing={typing}
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
          />
        );
        return;
      }
      allChat.push(
        <Chat
          key={chat.id}
          chat={chat}
          creator={creator}
          active={active}
          setActive={setActive}
          typing={typing}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
        />
      );
      return;
    });
  }

  useEffect(() => {
    const closeContextMenu = (e) => {
      if (e.keyCode === 27) {
        setContextMenu('');
        return;
      }

      if (!e.keyCode) {
        e.preventDefault();
        setContextMenu('');
      }
    };
    if (contextMenu) {
      window.addEventListener('keydown', closeContextMenu);
      window.addEventListener('contextmenu', closeContextMenu);
    }
    return () => {
      window.removeEventListener('keydown', closeContextMenu);
      window.removeEventListener('contextmenu', closeContextMenu);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, []);

  const dispatch = useDispatch();
  const ws = useSelector(selectWebSocket);
  const [updateChatMessageUnRead] = useUpdateChatMessageUnReadMutation();
  const asyncMutation = async ({ chatId, creator }) => {
    try {
      await updateChatMessageUnRead({ chatId, creator });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (ws) {
      ws.on(RECEIVE_MESSAGE_FORM_TARGET, (response) => {
        refetch();
        updateChatMessageQueryData(response);
        if (active !== response.chatId) {
          updateUnreadCountQueryData(response.chatId, creator);
        } else {
          asyncMutation({ chatId: response.chatId, creator });
        }
      });
      ws.on(RECEIVE_TYPING_FROM_TARGET, (response) => {
        const { type, chatId } = response;
        switch (type) {
          case 'active':
            dispatch(addTypings(chatId));
            break;
          case 'inActive':
            dispatch(removeTypings(chatId));
            break;
        }
      });
    }
    return () => {
      if (ws) {
        ws.off(RECEIVE_MESSAGE_FORM_TARGET);
        ws.off(RECEIVE_TYPING_FROM_TARGET);
      }
    };
  }, [ws, active]);

  return (
    <section className="chat-list-box">
      <article>
        {pined.length !== 0 && (
          <p className="subject">
            <FontAwesomeIcon icon={faThumbtack} />
            &nbsp; <span>Pined Chat</span>
          </p>
        )}
        {pined}
      </article>
      <article>
        <p className="subject">
          <FontAwesomeIcon icon={faComment} />
          &nbsp; <span>All Chat</span>
        </p>
        {allChat}
      </article>
    </section>
  );
};

export default ChatList;
