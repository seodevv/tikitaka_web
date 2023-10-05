import '../../css/feed.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeedContent from './FeedContent';
import FeedHeader from './FeedHeader';
import { useSelector } from 'react-redux';
import { selectCreator } from '../login/loginReducer';
import FeedFollowers from './FeedFollowers';
import FeedFollowings from './FeedFollowings';
import FeedTabs from './FeedTabs';

const FeedPage = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const creator = useSelector(selectCreator);
  const [userId, setUserId] = useState();
  const [owner, setOwner] = useState(false);
  const [filter, setFilter] = useState('feed');

  const [followers, setFollowers] = useState(false);
  const [followings, setFollowings] = useState(false);

  useEffect(() => {
    if (id && !isNaN(id)) {
      setUserId(parseInt(id));
    } else if (creator && isNaN(id)) {
      setUserId(creator.id);
      navigator('/feed');
    }
  }, [id, creator]);

  useEffect(() => {
    if (creator && creator.id === userId) {
      setOwner(true);
    } else {
      setOwner(false);
      setFilter('feed');
    }
  }, [creator, userId]);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        setFollowers(false);
        setFollowings(false);
      }
    };
    if (followers || followings) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [followers, followings]);

  return (
    <>
      <section className="feed-box ani-fade-in">
        <FeedHeader
          userId={userId}
          setUserId={setUserId}
          setFollowers={setFollowers}
          setFollowings={setFollowings}
        />
        {owner && <FeedTabs filter={filter} setFilter={setFilter} />}
        <FeedContent userId={userId} filter={filter} setFilter={setFilter} />
        {followers && (
          <FeedFollowers userId={userId} setFollowers={setFollowers} />
        )}
        {followings && (
          <FeedFollowings userId={userId} setFollowings={setFollowings} />
        )}
      </section>
    </>
  );
};

export default FeedPage;
