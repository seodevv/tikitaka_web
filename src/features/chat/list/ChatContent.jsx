import React, { useEffect, useState } from 'react';
import ChatTitle from './ChatTitle';
import ChatList from './ChatList';
import Search from './Search';
import ChatDetail from '../detail/ChatDetail';
import { useSearchParams } from 'react-router-dom';

const ChatContent = () => {
  const [search, setSearch] = useState(false);
  const [active, setActive] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('chatId')) {
      setActive(searchParams.get('chatId'));
    }
  }, [searchParams]);

  return (
    <>
      <section className="chat-box flex-col-no of-hidden p-relative ani-fade-in">
        <ChatTitle setSearch={setSearch} />
        <ChatList active={active} setActive={setActive} />
        {search && <Search setSearch={setSearch} setActive={setActive} />}
      </section>
      {active && <ChatDetail chatId={active} setChatId={setActive} />}
    </>
  );
};

export default ChatContent;
