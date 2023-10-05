import {
  faHashtag,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Profile from '../../../components/Profile';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useSearchSocialMutation } from '../socialApiSlice';
import { useDispatch } from 'react-redux';
import { addFilter, showMessage } from '../socialReducer';

const MobileSearch = styled.div`
  padding: 30px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 501;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
`;

const MobileSearchInnerBox = styled.div`
  margin-top: 30px;
  max-width: 250px;

  input {
    padding: 10px;
    padding-right: 20px;
    position: relative;
    display: block;
    width: 100%;
    background: rgba(0, 0, 0, 0.75);
    border: none;
    font-size: 1rem;
    color: #fff;
    text-align: center;
    outline: none;
    box-shadow: 0 0 5px #aaa;
  }

  .list {
    margin-top: 15px;
    padding: 10px;
    max-height: 75vh;
    background: rgba(0, 0, 0, 0.75);
    overflow: scroll;
    box-shadow: 0 0 5px #aaa;
  }

  .item {
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100%;

    > div:nth-child(1) {
      width: 40px;
      height: 40px;
    }

    .profile {
      width: 40px;
      height: 40px;
    }

    .text {
      padding: 0 10px;
      flex-grow: 1;
      font-size: 0.95rem;
      color: #fff;
      text-align: center;
    }

    .hashtag {
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.75);
      border: none;
      border-radius: 50%;
    }

    &:active {
      background: rgba(0, 67, 130, 0.75);
    }
  }

  .item + .item {
    margin-top: 5px;
  }
`;

const SearchSpinner = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const SearchNothing = styled.div`
  padding: 10px;
  color: #fff;
  text-align: center;
`;

const SearchClose = styled(FontAwesomeIcon)`
  position: absolute;
  top: 25px;
  right: 25px;
`;

const User = ({ type, profile, nick, setSelector }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="item"
      onClick={() => {
        dispatch(addFilter({ type: 'user', value: nick }));
        setSelector('idle');
      }}
    >
      <Profile type={type} profile={profile} />
      <p className="text">{nick}</p>
    </div>
  );
};

const HashTag = ({ tag, setSelector }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="item"
      onClick={() => {
        dispatch(addFilter({ type: 'tag', value: tag }));
        setSelector('idle');
      }}
    >
      <div className="hashtag">
        <FontAwesomeIcon icon={faHashtag} size="lg" color="#fff" />
      </div>
      <p className="text">{tag}</p>
    </div>
  );
};

const MobileSearchUser = ({ setSelector }) => {
  const dispatch = useDispatch();

  const [searchWord, setSearchWord] = useState('');
  const [userList, setUserList] = useState('idle');
  const [tagList, setTagList] = useState('idle');
  const searchTimer = useRef(null);

  const [searchSocial, { isLoading }] = useSearchSocialMutation();
  const onChangeSearchWord = (e) => {
    if (searchTimer.current) clearTimeout(searchTimer);
    if (e.target.value.length > 12) {
      dispatch(showMessage('최대 12 자까지 가능합니다.'));
      return;
    }
    setSearchWord(e.target.value);

    if (!e.target.value.trim()) {
      setUserList('idle');
      setTagList('idle');
      return;
    }

    if (e.target.value.trim()) {
      searchTimer.current = setTimeout(async () => {
        try {
          const response = await searchSocial({
            searchWord: e.target.value,
          }).unwrap();
          if (!e.target.value.trim()) return;
          if (e.target.value.length > 12) return;
          setUserList(response.user);
          setTagList(response.tag);
        } catch (error) {
          console.error(error);
        }
      }, 300);
    }
  };

  useEffect(() => {
    const listner = (e) => {
      if (e.keyCode === 27) {
        setSelector('idle');
      }
    };
    window.addEventListener('keydown', listner);
    return () => {
      window.removeEventListener('keydown', listner);
    };
  }, []);

  return (
    <>
      <MobileSearch className="ani-fade-in">
        <SearchClose
          icon={faXmark}
          color="#fff"
          size="xl"
          onClick={(e) => {
            e.stopPropagation();
            setSelector('idle');
          }}
        />
        <MobileSearchInnerBox>
          <div className="p-relative">
            <input value={searchWord} onChange={onChangeSearchWord} />
            {isLoading && (
              <SearchSpinner icon={faSpinner} color="#fff" size="lg" spin />
            )}
          </div>
          {userList !== 'idle' && tagList !== 'idle' && (
            <div className="list">
              {userList.map((user) => (
                <User
                  key={user.id}
                  type={user.type}
                  profile={user.profile}
                  nick={user.nick}
                  setSelector={setSelector}
                />
              ))}
              {tagList.map((tag, i) => (
                <HashTag key={i} tag={tag.tag} setSelector={setSelector} />
              ))}
              {userList.length === 0 && tagList.length === 0 && (
                <SearchNothing>
                  <h4>검색 결과가 없습니다.</h4>
                </SearchNothing>
              )}
            </div>
          )}
        </MobileSearchInnerBox>
      </MobileSearch>
    </>
  );
};

export default MobileSearchUser;
