import { useDispatch, useSelector } from 'react-redux';
import {
  addFilter,
  removeFilter,
  selectFilter,
  selectOnActionTop,
  setOnAction,
  showCreative,
} from '../socialReducer';
import styled from 'styled-components';
import { selectCreatorId } from '../../login/loginReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretUp,
  faClockRotateLeft,
  faFlorinSign,
  faPlus,
  faRotateRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import SocialSearch from './MobileSearchUser';
import MobileFilters from './MobileFilters';

const MobileRelative = styled.div`
  position: relative;
  animation-name: ${(props) => (props.fadeIn ? 'fade-in' : '')};
  animation-duration: 0.3s;
  animation-timing-function: ease-in;
`;

const MobileTopRight = styled.div`
  position: fixed;
  top: 70px;
  right: 15px;
  z-index: 500;
`;

const MobileIcons = styled(FontAwesomeIcon)`
  margin-top: 5px;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 15px;
  height: 15px;
  background: ${(props) => (props.bg ? props.bg : ' rgba(0, 0, 0, 0.75)')};
  border-radius: 10px;
  border-top-left-radius: ${(props) => (props.active ? '0px' : '10px')};
  border-bottom-left-radius: ${(props) => (props.active ? '0px' : '10px')};

  &:active {
    background: var(--tikitaka-color);
  }
`;

const MobilePeriodSelector = styled.div`
  position: absolute;
  top: 0;
  right: 35px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100px;
  height: 35px;
  background: rgba(0, 0, 0, 0.75);
  border-top-left-radius: 5px;
  animation-name: slide-in-right-left;
  animation-duration: 0.3s;
  animation-timing-function: ease-in;
`;

const MobilePeriod = styled.span`
  margin-right: 5px;
  display: block;
  flex-grow: 1;
  font-size: 1rem;
  color: #fff;
  text-align: center;
`;

const MobilePeriodList = styled.div`
  position: absolute;
  top: 35px;
  right: 40px;
  width: 95px;
  overflow: hidden;
  animation-name: period-dropdown;
  animation-duration: 0.3s;
  animation-timing-function: ease-in;
`;

const MobilePeriodItem = styled.li`
  padding: 3px;
  color: #fff;
  background: ${(props) =>
    props.active ? 'var(--tikitaka-color)' : 'rgba(0,0,0,0.75)'};
  font-size: 1rem;
  text-align: center;
  list-style: none;
  line-height: 1.5rem;

  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const MobileFeatures = () => {
  const filters = useSelector(selectFilter);
  const top = useSelector(selectOnActionTop);
  const creatorId = useSelector(selectCreatorId);
  const dispatch = useDispatch();

  const [selector, setSelector] = useState('idle');
  const periodArray = ['recent', '12 hours', '24 hours', '7 days', '1 month'];
  const [periodSelect, setPeriodSelect] = useState(false);

  const preventEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <>
      {selector === 'search' && <SocialSearch setSelector={setSelector} />}
      <MobileRelative>
        <MobileTopRight>
          <MobileRelative>
            <MobileIcons
              icon={faSearch}
              size="lg"
              color="#fff"
              onClick={(e) => {
                preventEvent(e);
                setSelector('search');
              }}
            />
          </MobileRelative>
          <MobileRelative>
            <MobileIcons
              icon={faFlorinSign}
              size="lg"
              color="#fff"
              onClick={(e) => {
                preventEvent(e);
                if (filters.follower !== '') {
                  dispatch(removeFilter({ type: 'follower' }));
                } else {
                  dispatch(addFilter({ type: 'follower', value: creatorId }));
                }
              }}
            />
          </MobileRelative>
          <MobileRelative>
            <MobileIcons
              active={selector === 'period' ? 'true' : ''}
              icon={faClockRotateLeft}
              size="lg"
              color="#fff"
              onClick={(e) => {
                preventEvent(e);
                if (selector === 'period') {
                  setSelector('idle');
                  setPeriodSelect(false);
                } else {
                  setSelector('period');
                }
              }}
            />
            {selector === 'period' && (
              <MobilePeriodSelector
                onClick={(e) => {
                  preventEvent(e);
                  setPeriodSelect((prev) => !prev);
                }}
              >
                <MobilePeriod>
                  {filters.period.replace(/^[a-z]/, (char) =>
                    char.toUpperCase()
                  )}
                </MobilePeriod>
              </MobilePeriodSelector>
            )}
            {periodSelect && (
              <MobilePeriodList>
                {periodArray.map((item, i) => {
                  return (
                    <MobilePeriodItem
                      key={i}
                      active={item === filters.period ? 'true' : ''}
                      onClick={(e) => {
                        preventEvent(e);
                        dispatch(addFilter({ type: 'period', value: item }));
                        setPeriodSelect(false);
                        setSelector('idle');
                      }}
                    >
                      {item.replace(/^[a-z]/, (chat) => chat.toUpperCase())}
                    </MobilePeriodItem>
                  );
                })}
              </MobilePeriodList>
            )}
          </MobileRelative>
          <MobileRelative>
            <MobileIcons
              icon={faRotateRight}
              size="lg"
              color="#fff"
              onClick={(e) => {
                preventEvent(e);
                dispatch(setOnAction({ type: 'refresh', value: true }));
              }}
            />
          </MobileRelative>
          <MobileRelative>
            <MobileIcons
              icon={faPlus}
              size="lg"
              color="#fff"
              onClick={(e) => {
                preventEvent(e);
                dispatch(showCreative());
              }}
            />
          </MobileRelative>
          {top > 500 && (
            <MobileRelative fadeIn>
              <MobileIcons
                icon={faCaretUp}
                size="lg"
                color="#fff"
                bg="var(--tikitaka-color)"
                onClick={(e) => {
                  preventEvent(e);
                  dispatch(setOnAction({ type: 'onTop', value: true }));
                }}
              />
            </MobileRelative>
          )}
        </MobileTopRight>
        <MobileFilters filters={filters} />
      </MobileRelative>
    </>
  );
};

export default MobileFeatures;
