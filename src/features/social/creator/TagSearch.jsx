import { useRef, useState } from 'react';
import { useSearchTagMutation } from '../socialApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../components/Spinner';
import Tag from '../../../components/Tag';

const TagSearch = ({ tempTags, setTempTags }) => {
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const searchRef = useRef(null);

  const searchTimer = useRef(null);
  const [searchTag, { isLoading }] = useSearchTagMutation();
  const onChangeSearch = (e) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    const value = e.target.value.trim().replace(/#|\s/, '');
    if (value.length > 15) return;
    setSearch(value);

    if (value.trim()) {
      searchTimer.current = setTimeout(async () => {
        try {
          const response = await searchTag({
            searchTag: value,
          });

          let data = [...response.data];
          const exist = data.find((v) => v.tag === value);
          if (!exist) {
            data.unshift({ tag: value, count: 0 });
          }
          setSearchList(data);
        } catch (error) {
          console.error(
            'An error occurred while receiving the search tag.',
            error
          );
        }
      }, 300);
    }
  };

  const onClickAddTag = (tag) => {
    if (tempTags.length === 10) return;
    setTempTags((prev) => [...prev, tag]);
    if (searchRef.current) {
      setSearch('');
      searchRef.current.focus();
    }
  };
  const onClickRemoveTag = (index) => {
    setTempTags((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  let tagList;
  if (tempTags.length !== 0) {
    tagList = (
      <div className="tag-box">
        {tempTags.map((tag, i) => {
          const isHangle = /[가-힣]/.test(tag) ? 'hangle' : '';
          return (
            <Tag key={i} className={`tag ${isHangle}`}>
              {tag}
              <button
                className="tag-remove btn-effect"
                onClick={() => onClickRemoveTag(i)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Tag>
          );
        })}
      </div>
    );
  }

  let list;
  if (isLoading) {
    list = <Spinner className="tag-loading" size="1x" />;
  } else if (searchList.length !== 0) {
    list = searchList.map((v, i) => {
      const isHangle = /[가-힣]/.test(v.tag) ? 'hangle' : '';
      return (
        <span key={i} className={isHangle} onClick={() => onClickAddTag(v.tag)}>
          #{v.tag} <span className="count">{v.count} posts</span>
          <br />
        </span>
      );
    });
  }

  return (
    <>
      <div className="tags">
        {tagList}
        <input
          className="input"
          placeholder="태그 검색"
          value={search}
          onChange={onChangeSearch}
          ref={searchRef}
          spellCheck="false"
        />
        <div className="tag-search">
          <div className="list scroll-none">{list}</div>
        </div>
        <p className="info">태그는 최대 10개까지 등록 가능합니다.</p>
      </div>
    </>
  );
};

export default TagSearch;
