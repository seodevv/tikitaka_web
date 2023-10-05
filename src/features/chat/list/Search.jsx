import { useEffect, useRef, useState } from 'react';
import { useGetSearchUsersMutation } from '../chatApiSlice';
import SearchUser from './SearchUser';
import Button from '../../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCircleNotch,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectCreator } from '../../login/loginReducer';

const Search = ({ setSearch, setActive }) => {
  const [searchList, setSearchList] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [isError, setIsError] = useState('');

  const userInfo = useSelector(selectCreator);
  const creator = userInfo ? userInfo.id : '';
  const timer = useRef(null);
  const [getSearchUsers, { isLoading }] = useGetSearchUsersMutation();
  const onChangeSearchId = (e) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setIsError('');
    setSearchId(e.target.value);

    if (e.target.value) {
      timer.current = setTimeout(async () => {
        setSearchList([]);
        try {
          const response = await getSearchUsers({
            searchId: e.target.value,
            id: creator,
          }).unwrap();
          setSearchList(response);
        } catch (error) {
          console.error(error);
          setIsError('lazy');
          setTimeout(() => {
            setIsError('Sorry, Please try again');
          }, 1000);
        }
      }, 300);
    }
  };

  const onClickSearchClose = () => setSearch(false);
  const onKeyDownSearchClose = (e) => {
    if (e.keyCode === 27) setSearch(false);
  };
  const onClickDeleteSearch = () => {
    if (searchId) setSearchId('');
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  return (
    <div className="chat-add-box p-absolute" onKeyDown={onKeyDownSearchClose}>
      <div className="p-relative">
        <Button
          className="search-box-close btn-effect p-absolute"
          icon={faChevronLeft}
          size="lg"
          onClick={onClickSearchClose}
        />
        <h3 className="title">Search</h3>
        <div className="p-relative">
          <input
            type="text"
            placeholder="search"
            value={searchId}
            onChange={onChangeSearchId}
            ref={inputRef}
          />
          <Button
            className="btn-effect"
            icon={faXmark}
            onClick={onClickDeleteSearch}
          />
        </div>

        {isError && (
          <div className="search-box text-center">
            {isError == 'lazy' ? (
              <FontAwesomeIcon
                icon="fa-solid fa-circle-notch"
                size="2xl"
                spin
              />
            ) : (
              <h3 className="error">{isError}</h3>
            )}
          </div>
        )}

        {isLoading && (
          <div className="search-box text-center">
            <FontAwesomeIcon icon={faCircleNotch} size="2xl" spin />
          </div>
        )}

        {searchList.length !== 0 && (
          <div className="search-box text-center">
            {searchList.map((target) => (
              <SearchUser
                key={target.id}
                target={target}
                id={creator}
                setSearch={setSearch}
                setIsError={setIsError}
                setActive={setActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
