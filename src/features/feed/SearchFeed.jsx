import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Profile from '../../components/Profile';
import Spinner from '../../components/Spinner';
import { usePostFeedsSearchUserMutation } from './feedApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectViewPort } from '../social/socialReducer';

const SearchFeed = ({ setStatus }) => {
  const navigator = useNavigate();
  const viewport = useSelector(selectViewPort);

  const [style, setStyle] = useState({});
  const [noData, setNoData] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const inputRef = useRef(null);
  const searchTimer = useRef(null);
  const isComposing = useRef(false);
  const [search, { isLoading }] = usePostFeedsSearchUserMutation();
  const onChangeSearchWord = (e) => {
    const inputType = e.nativeEvent.inputType;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (e.target.value.length > 15) return;
    if (e.nativeEvent.isComposing) {
      isComposing.current = true;
    } else if (inputType === 'deleteContentBackward' && isComposing.current) {
      return;
    } else if (inputType === 'insertText' && isComposing.current) {
      isComposing.current = false;
      return;
    }
    setSearchWord(e.target.value);
    setSearchList([]);
    setNoData(false);

    if (e.target.value) {
      searchTimer.current = setTimeout(async () => {
        try {
          const value = e.target.value;
          const response = await search({
            searchWord: e.target.value,
          }).unwrap();
          if (value !== e.target.value) return;
          if (response.length === 0) setNoData(true);
          setSearchList(response);
        } catch (error) {
          console.error(error);
        }
      }, 500);
    }
  };

  const onClickMoveFeed = (userId) => {
    if (viewport.width > 540) return;
    navigator(`/feed/${userId}`);
    setStatus(false);
  };

  const onDoubleClickMoveFeed = (userId) => {
    navigator(`/feed/${userId}`);
    setStatus(false);
  };

  useLayoutEffect(() => {
    if (searchList.length === 0) {
      setStyle({});
    } else {
      setStyle({ padding: '12px 2px 12px 12px' });
    }
  }, [searchList]);

  useEffect(() => {
    inputRef.current && setTimeout(() => inputRef.current.focus(), 50);
  }, []);

  return (
    <>
      <div className="modal-container ani-fade-in">
        <div className="inner">
          <div className="p-relative">
            <input
              className="user-search"
              ref={inputRef}
              value={searchWord}
              onChange={onChangeSearchWord}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 8) {
                  isComposing.current = false;
                }
              }}
            />
            <FontAwesomeIcon
              className="search-icon"
              icon={faSearch}
              color="#fff"
            />
            {searchWord !== '' && (
              <FontAwesomeIcon
                className="search-cleaner btn-effect transit-none"
                icon={faXmark}
                color="#fff"
                onClick={() => {
                  setSearchWord('');
                  inputRef.current && inputRef.current.focus();
                }}
              />
            )}
          </div>
          <div
            className={`search-result ${isLoading ? 'scroll-none' : ''}`}
            style={style}
          >
            {isLoading && (
              <Spinner style={{ padding: '5px', textAlign: 'center' }} />
            )}

            {searchList.map((item) => {
              const isHangle = /[가-힣]/.test(item.nick) ? 'hangle' : '';
              return (
                <div
                  key={item.id}
                  className="search-item"
                  onClick={() => onClickMoveFeed(item.id)}
                  onDoubleClick={() => onDoubleClickMoveFeed(item.id)}
                >
                  <Profile type={item.type} profile={item.profile} />
                  <div>
                    <p className={isHangle}>{item.nick}</p>
                    <span>
                      Posts <span className="count">{item.posts}</span>
                    </span>
                    <span>
                      Followers <span className="count">{item.followers}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {noData && <div className="no-data">User not found 😢</div>}
          </div>
        </div>
        <FontAwesomeIcon
          className="close btn-effect"
          icon={faXmark}
          size="2xl"
          color="#fff"
          onClick={() => setStatus(false)}
        />
      </div>
    </>
  );
};

export default SearchFeed;
