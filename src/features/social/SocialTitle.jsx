import Title from '../../components/Title';
import { FlexGrowBox } from '../../components/Styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCameraRetro,
  faCaretDown,
  faClockRotateLeft,
  faFlorinSign,
  faHashtag,
  faMagnifyingGlass,
  faSpinner,
  faTag,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useSearchSocialMutation } from './socialApiSlice';
import Profile from '../../components/Profile';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFilter,
  removeFilter,
  selectFilter,
  showCreative,
} from './socialReducer';
import { selectCreatorId } from '../login/loginReducer';

const SocialTitle = () => {
  const creatorId = useSelector(selectCreatorId);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();

  const selectList = ['recent', '12 hours', '24 hours', '7 days', '1 month'];
  const [checked, setChceked] = useState(false);

  const [search, setSearch] = useState(false);
  const [user, setUser] = useState('idle');
  const [tag, setTag] = useState('idle');
  const isSearching = user !== 'idle' && tag !== 'idle';

  const timer = useRef(null);
  const inputRef = useRef(null);
  const [searchWord, setSearchWord] = useState('');
  const [searchSocial, { isLoading }] = useSearchSocialMutation();
  const onChangeSearchWord = (e) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setSearchWord(e.target.value);

    if (!e.target.value.trim()) {
      setUser('idle');
      setTag('idle');
      return;
    }

    if (e.target.value.trim()) {
      timer.current = setTimeout(async () => {
        try {
          const response = await searchSocial({
            searchWord: e.target.value,
          }).unwrap();
          setUser(response.user);
          setTag(response.tag);
        } catch (error) {
          console.error(error);
        }
      }, 300);
    }
  };
  const onClickOpenCreative = () => dispatch(showCreative());
  const onClickToggleSearch = () => setSearch((prev) => !prev);
  const onClickSetFilter = (type, value) => {
    dispatch(addFilter({ type, value }));
    setSearch(false);
    setSearchWord('');
    setUser('idle');
    setTag('idle');
  };
  const onClickRemoveFilter = (type, index) =>
    dispatch(removeFilter({ type, index }));

  let loading;
  if (isLoading) {
    loading = <FontAwesomeIcon className="loading" icon={faSpinner} spin />;
  }

  let content;
  if (!isSearching) {
    content = <div className="box"></div>;
  } else {
    content = (
      <div className="box show">
        {user.map((v) => {
          const isHangle = /[가-힣]/.test(v.nick) ? 'hangle' : '';
          return (
            <div
              key={v.id}
              className="item"
              onDoubleClick={() => onClickSetFilter('user', v.nick)}
            >
              <Profile className="profile" type={v.type} profile={v.profile} />
              <h5 className={`${isHangle}`}>{v.nick}</h5>
            </div>
          );
        })}
        {tag.map((v) => {
          const isHangle = /[가-힣]/.test(v.tag) ? 'hangle' : '';
          return (
            <div
              key={v.tag}
              className="item"
              onDoubleClick={() => {
                onClickSetFilter('tag', v.tag);
              }}
            >
              <div className="tag">
                <FontAwesomeIcon icon={faHashtag} />
              </div>
              <h5 className={isHangle}>{v.tag}</h5>
            </div>
          );
        })}
      </div>
    );
  }

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) setSearch(false);
    };
    if (search) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [search]);

  return (
    <>
      <div className="social-box-title flex-row-no flex-justify-start flex-align-center">
        <div className="polaroid"></div>
        <Title text="Social" />
        <FlexGrowBox />
        <div className="selector">
          <button
            className="btn-effect transit-none"
            onClick={() => setChceked((prev) => !prev)}
          >
            <div className="flex-grow text-center">{filter.period}</div>
            <FontAwesomeIcon className="icon" icon={faCaretDown} />
          </button>
          <ul className={`dropdown ${checked ? 'active' : ''}`}>
            {selectList.map((data) => (
              <li
                key={data}
                onClick={() => {
                  dispatch(addFilter({ type: 'period', value: data }));
                  setChceked(false);
                }}
              >
                {data}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="button btn-effect transit-none"
          onClick={() =>
            dispatch(addFilter({ type: 'follower', value: creatorId }))
          }
        >
          <FontAwesomeIcon icon={faFlorinSign} />
        </button>
        <button className="button btn-effect transit-none">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            onClick={onClickToggleSearch}
          />
        </button>
        <button
          className="button btn-effect transit-none"
          onClick={onClickOpenCreative}
        >
          <FontAwesomeIcon icon={faCameraRetro} />
        </button>
        {search && (
          <div className="search ani-fade-in">
            <input
              ref={inputRef}
              value={searchWord}
              onChange={onChangeSearchWord}
              spellCheck="false"
            />
            {loading}
            {content}
          </div>
        )}
        {!search &&
          (filter.user !== '' ||
            filter.tags.length !== 0 ||
            filter.follower !== '' ||
            filter.period !== 'recent') && (
            <div className="filters ani-fade-in">
              {filter.user !== '' && (
                <div className="filter">
                  <FontAwesomeIcon icon={faUser} />
                  <p className={/[가-힣]/.test(filter.user) ? 'hangle' : ''}>
                    {filter.user}
                  </p>
                  <FontAwesomeIcon
                    className="close btn-effect transit-none"
                    icon={faXmark}
                    onClick={() => onClickRemoveFilter('user')}
                  />
                </div>
              )}
              {filter.follower !== '' && (
                <div className="filter">
                  <FontAwesomeIcon icon={faFlorinSign} />
                  <p>followers</p>
                  <FontAwesomeIcon
                    className="close btn-effect transit-none"
                    icon={faXmark}
                    onClick={() => onClickRemoveFilter('follower')}
                  />
                </div>
              )}
              {filter.period !== 'recent' && (
                <div className="filter">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                  <p>{filter.period}</p>
                  <FontAwesomeIcon
                    className="close btn-effect transit-none"
                    icon={faXmark}
                    onClick={() => onClickRemoveFilter('period')}
                  />
                </div>
              )}
              {filter.tags.map((tag, i) => {
                const hangle = /[가-힣]/.test(tag, indexedDB) ? 'hangle' : '';
                return (
                  <div key={i} className="filter">
                    <FontAwesomeIcon icon={faTag} />
                    <p className={hangle}>{tag}</p>
                    <FontAwesomeIcon
                      className="close btn-effect transit-none"
                      icon={faXmark}
                      onClick={() => onClickRemoveFilter('tags', i)}
                    />
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
};

export default SocialTitle;
