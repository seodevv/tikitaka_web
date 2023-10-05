import {
  faClockRotateLeft,
  faFlorinSign,
  faTag,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { removeFilter } from '../socialReducer';
import styled from 'styled-components';

const MobileCenterLeft = styled.div`
  position: fixed;
  top: 25vh;
  left: 15px;
  z-index: 500;
`;

const MobileFilterSpan = styled.span`
  margin-top: 5px;
  padding: 5px 10px;
  display: inline;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  font-size: 1rem;
  color: #fff;
  line-height: 2rem;
  animation-name: fade-in;
  animation-duration: 0.3s;
  animation-timing-function: ease-in;
`;

const MobileFilters = ({ filters }) => {
  const dispatch = useDispatch();

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  let user;
  let tags;
  let follower;
  let period;
  let close = (type, index) => (
    <FontAwesomeIcon
      icon={faXmark}
      color="#fff"
      style={{ marginLeft: '5px' }}
      onClick={(e) => {
        preventEvent(e);
        dispatch(removeFilter({ type, index }));
      }}
    />
  );
  if (filters.user !== '') {
    user = (
      <MobileFilterSpan>
        <FontAwesomeIcon
          icon={faUser}
          size="sm"
          color="#fff"
          style={{ marginRight: '5px' }}
        />
        {filters.user}
        {close('user')}
        <br />
      </MobileFilterSpan>
    );
  }
  if (filters.tags.length !== 0) {
    tags = filters.tags.map((tag, i) => (
      <MobileFilterSpan key={tag}>
        <FontAwesomeIcon
          icon={faTag}
          size="sm"
          color="#fff"
          style={{ marginRight: '5px' }}
        />
        {tag}
        {close('tags', i)}
        <br />
      </MobileFilterSpan>
    ));
  }
  if (filters.follower !== '') {
    follower = (
      <MobileFilterSpan>
        <FontAwesomeIcon
          icon={faFlorinSign}
          size="sm"
          color="#fff"
          style={{ marginRight: '5px' }}
        />
        Followers
        {close('follower')}
        <br />
      </MobileFilterSpan>
    );
  }
  if (filters.period !== 'recent') {
    period = (
      <MobileFilterSpan>
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          size="sm"
          color="#fff"
          style={{ marginRight: '5px' }}
        />
        {filters.period}
        {close('period')}
        <br />
      </MobileFilterSpan>
    );
  }

  return (
    <>
      <MobileCenterLeft>
        {user}
        {tags}
        {follower}
        {period}
      </MobileCenterLeft>
    </>
  );
};

export default MobileFilters;
