import { useDispatch } from 'react-redux';
import { useGetFeedsMoreMutation, useGetFeedsQuery } from './feedApiSlice';
import { showArticle } from '../social/socialReducer';
import { useRef } from 'react';
import { useState } from 'react';
import Spinner from '../../components/Spinner';
import { useEffect } from 'react';

const FeedContent = ({ userId, filter }) => {
  if (!userId) return;
  const scrollRef = useRef(null);
  const [endStatus, setEndStatus] = useState({ feed: false, bookmark: false });
  const filterChanged = useRef(false);
  const userChanged = useRef(false);

  const dispatch = useDispatch();
  const {
    data: feeds,
    isSuccess,
    isFetching,
  } = useGetFeedsQuery({
    userId,
    limit: process.env.FEED_LIMIT || 20,
    filter,
  });

  const onClickOpenSocialDetail = (socialId) =>
    dispatch(showArticle({ id: socialId, ids: feeds.map((v) => v.id) }));

  const [getMore, { isLoading: moreLoading }] = useGetFeedsMoreMutation();
  const onScrollFeeds = async () => {
    if (!scrollRef.current) return;
    if (moreLoading) return;
    if (filterChanged.current) {
      filterChanged.current = false;
      return;
    }
    if (userChanged.current) {
      userChanged.current = false;
      return;
    }
    const { clientHeight, scrollTop, scrollHeight } = scrollRef.current;
    const isBottom =
      parseInt((clientHeight + scrollTop) / 10) === parseInt(scrollHeight / 10);
    const isEnded =
      (filter === 'feed' && endStatus.feed) ||
      (filter === 'bookmark' && endStatus.bookmark);
    if (isBottom && !isEnded) {
      try {
        const response = await getMore({
          ids: feeds.map((v) => v.id),
          modified: feeds[feeds.length - 1].modified,
          userId,
          limit: process.env.FEED_LIMIT || 20,
          filter,
        }).unwrap();
        if (response.last) {
          setEndStatus((prev) => ({
            feed: filter === 'feed' ? true : prev.feed,
            bookmark: filter === 'bookmark' ? true : prev.bookmark,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    filterChanged.current = true;
  }, [filter]);

  useEffect(() => {
    if (scrollRef.current && moreLoading) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [moreLoading]);

  useEffect(() => {
    if (userId) {
      setEndStatus({ feed: false, bookmark: false });
      userChanged.current = true;
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [userId]);

  let content;
  if (isSuccess & !isFetching) {
    content = feeds.map((feed) => {
      let src = process.env.SERVER_URL;
      if (feed.type === 'image') {
        const split = feed.media.split('/');
        src += `/img/social/${feed.userId}/${split[0]}`;
      } else {
        src += `/video/social/${feed.userId}/${feed.thumbnail}`;
      }
      return (
        <div
          key={feed.id}
          className="feed"
          onClick={() => onClickOpenSocialDetail(feed.id)}
        >
          <img src={src} alt={src} draggable="false" />
        </div>
      );
    });
  }

  return (
    <>
      <div
        className="feed-content scroll-none"
        ref={scrollRef}
        onScroll={onScrollFeeds}
      >
        <div className="feed-line">{content}</div>
        {moreLoading && <Spinner className="loading" color="#000" />}
      </div>
    </>
  );
};

export default FeedContent;
