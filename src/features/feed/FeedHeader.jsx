import { useNavigate } from 'react-router-dom';
import Profile from '../../components/Profile';
import {
  useGetFeedsCountQuery,
  useGetFeedsIsFollowQuery,
  useGetFeedsUserInfoQuery,
  usePostFeedsToggleFollowMutation,
} from './feedApiSlice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreator } from '../login/loginReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCirclePlus,
  faGear,
  faHouseUser,
  faMagnifyingGlass,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import FeedDescEditor from './FeedDescEditor';
import {
  useAddChatMutation,
  useUpdateChatDateMutation,
} from '../chat/chatApiSlice';
import { showMessage } from '../social/socialReducer';
import { nanoid } from '@reduxjs/toolkit';
import SearchFeed from './SearchFeed';

const FeedHeader = ({ userId, setUserId, setFollowers, setFollowings }) => {
  if (!userId) return;

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const creator = useSelector(selectCreator);
  const [owner, setOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchFeed, setSearchFeed] = useState(false);

  const {
    data: userInfo = {
      success: true,
      type: 'App',
      profile: 'profile.png',
      nick: 'unknown',
      desc: '',
    },
    isSuccess,
    isFetching,
    isError,
  } = useGetFeedsUserInfoQuery({ userId });
  const {
    data: count = {
      posts: 0,
      followers: 0,
      followings: 0,
    },
  } = useGetFeedsCountQuery({ userId });

  const { data: isFollow } = useGetFeedsIsFollowQuery(
    {
      userId: creator.id,
      target: userId,
    },
    { skip: creator.id ? false : true }
  );

  const [toggleFollow] = usePostFeedsToggleFollowMutation();
  const onClickToggleFollow = async () => {
    try {
      await toggleFollow({
        userId: creator.id,
        target: userId,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const [addChat] = useAddChatMutation();
  const [updateChatDate] = useUpdateChatDateMutation();
  const onClickMessage = async () => {
    try {
      const response = await addChat({
        id: nanoid(process.env.NANO_ID_LENGTH || 8),
        creator: creator.id,
        target: userId,
      }).unwrap();

      if (response.exist) {
        await updateChatDate({ chatId: response.id });
      }
      navigator(`/chat?chatId=${response.id}`);
    } catch (error) {
      console.error(error);
      dispatch(showMessage('Server error'));
    }
  };

  let description = '';
  if (isSuccess && !isFetching && userInfo.success) {
    const split = userInfo.desc.split(/\r\n|\r|\n/);
    description = split.map((v, i) => {
      const isHangle = /[가-힣]/.test(v) ? 'hangle' : '';
      if (split.length - 1 === i) {
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
  }

  let isFollowStyle;
  let isFollowText = 'Follow';
  let isFollowMark = <FontAwesomeIcon icon={faCirclePlus} />;
  if (isFollow && isFollow.result) {
    isFollowStyle = {
      background: '#555555',
    };
    isFollowText = 'Following';
    isFollowMark = <FontAwesomeIcon icon={faCircleCheck} />;
  }

  useLayoutEffect(() => {
    if (creator && isError) {
      setUserId(creator.id);
      navigator('/feed');
    }
  }, [isError]);

  useLayoutEffect(() => {
    if (creator.id === userId) {
      setOwner(true);
    } else {
      setOwner(false);
    }
  }, [userId, creator]);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) setSearchFeed(false);
    };
    if (searchFeed) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [searchFeed]);

  return (
    <>
      <div className="feed-header">
        <Profile
          className="profile"
          type={userInfo.type}
          profile={userInfo.profile}
        />
        <div className="feed-info">
          <div>
            <p
              className={`nick ${
                /[가-힣]/.test(userInfo.nick) ? 'hangle' : ''
              }`}
            >
              {userInfo.nick}
            </p>
            {owner && (
              <FontAwesomeIcon
                className="setting btn-effect transit-none"
                icon={faGear}
                onClick={() => navigator('/settings')}
              />
            )}
          </div>
          <div className="follower">
            <p>Posts</p>
            <span>{count.posts}</span>
            <p
              className="button btn-effect transit-none"
              onClick={() => setFollowers(true)}
            >
              Followers
            </p>
            <span>{count.followers}</span>
            <p
              className="button btn-effect transit-none"
              onClick={() => setFollowings(true)}
            >
              Following
            </p>
            <span>{count.followings}</span>
          </div>
          {!owner && (
            <div className="feed-interactive">
              <button
                className="follow button transit-none"
                style={isFollowStyle}
                onClick={onClickToggleFollow}
              >
                {isFollowText}
                {isFollowMark}
              </button>
              <button
                className="message button transit-none"
                onClick={onClickMessage}
              >
                Message
              </button>
            </div>
          )}

          <div className="desc scroll-none">
            {editMode ? (
              <FeedDescEditor
                userId={userId}
                desc={userInfo.desc}
                setStatus={setEditMode}
              />
            ) : (
              description
            )}
            {owner && !editMode && (
              <div className="edit">
                <FontAwesomeIcon
                  className="btn-effect transit-none"
                  icon={faPenToSquare}
                  onClick={() => setEditMode(true)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="addons">
          <FontAwesomeIcon
            className="button btn-effect"
            icon={faHouseUser}
            color="#fff"
            onClick={() => navigator('/feed')}
          />
          <FontAwesomeIcon
            className="button btn-effect"
            icon={faMagnifyingGlass}
            color="#fff"
            onClick={() => setSearchFeed(true)}
          />
        </div>
        {searchFeed && <SearchFeed setStatus={setSearchFeed} />}
      </div>
    </>
  );
};

export default FeedHeader;
