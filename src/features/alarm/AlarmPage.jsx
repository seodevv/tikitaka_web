import '../../css/alarm.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCreatorId } from '../login/loginReducer';
import { useGetAlarmListQuery, usePostAlarmIsReadMutation } from './alarmSlice';
import AlarmPost from './AlarmPost';
import AlarmDirect from './AlarmDirect';
import { getRangeDate } from '../../app/common';

const AlarmPage = () => {
  const creatorId = useSelector(selectCreatorId);

  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const onScrollAlarmList = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const maxHeight = scrollHeight - clientHeight;
    setProgress(scrollTop / maxHeight);
  };

  const {
    data: alarmList,
    isSuccess,
    isError,
  } = useGetAlarmListQuery(
    { target: creatorId },
    { skip: !creatorId ? true : false, pollingInterval: 1000 * 60 }
  );
  let content;
  let classnames = 'alarm-list scroll-none';
  if (isError) {
    content = (
      <div>
        <h2>Network Error</h2>
        <p>Sorry, try again</p>
      </div>
    );
    classnames += ' alarm-alert';
  } else if (isSuccess && alarmList.result.length === 0) {
    content = (
      <div>
        <h3>알람이 없습니다.</h3>
        <p>소셜 활동을 해보시는건 어떤가요?</p>
      </div>
    );
    classnames += ' alarm-alert';
  } else if (isSuccess) {
    let prevDate;
    content = alarmList.result.map((alarm) => {
      const rangeDate = getRangeDate(alarm.created);
      const isDivision = prevDate !== rangeDate ? true : false;
      isDivision ? (prevDate = rangeDate) : '';
      const source = {
        id: alarm.source,
        type: alarm.sourceType,
        nick: alarm.sourceNick,
        profile: alarm.sourceProfile,
      };
      const social = {
        id: alarm.socialId,
        creator: creatorId,
        type: alarm.socialType,
        thumbnail: alarm.socialThumbnail,
        media: alarm.socialMedia,
      };
      switch (alarm.type) {
        case 'like':
        case 'reply':
          return (
            <div key={alarm.id}>
              {isDivision && (
                <div className="alarm-division">
                  <h4>{rangeDate}</h4>
                </div>
              )}
              <AlarmPost
                type={alarm.type}
                source={source}
                social={social}
                created={alarm.created}
              />
            </div>
          );
        case 'follow':
        case 'chat':
          return (
            <div key={alarm.id}>
              {isDivision && (
                <div className="alarm-division">
                  <h4>{rangeDate}</h4>
                </div>
              )}
              <AlarmDirect
                creatorId={creatorId}
                chatId={alarm.chatId}
                type={alarm.type}
                source={source}
                created={alarm.created}
              />
            </div>
          );
        default:
          return;
      }
    });
  }

  const [IsRead] = usePostAlarmIsReadMutation();
  useEffect(() => {
    const updateIsRead = async () => {
      try {
        await IsRead({ target: creatorId });
      } catch (error) {
        console.error(error);
      }
    };
    if (creatorId && isSuccess && alarmList) {
      updateIsRead();
    }
  }, [creatorId, alarmList]);

  return (
    <>
      <div className="alarm-box">
        <div className="alarm-scroll">
          <div
            className="progress"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
        <div
          className={classnames}
          ref={scrollRef}
          onScroll={onScrollAlarmList}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default AlarmPage;
