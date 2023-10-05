import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import SocialArticle from './article/SocialArticle';
import {
  useGetSocialMoreMutation,
  useGetSocialRecentQuery,
} from './socialApiSlice';
import Spinner from '../../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectOnAction, setOnAction } from './socialReducer';

const SocialContent = () => {
  const scrollRef = useRef(null);
  const filter = useSelector(selectFilter);
  const onAction = useSelector(selectOnAction);
  const dispatch = useDispatch();
  const {
    data: articles,
    isSuccess,
    isFetching,
    refetch,
  } = useGetSocialRecentQuery({
    limit: process.env.POST_LIMIT || 10,
    filter,
  });

  const [comment, setComment] = useState(0);
  const [lastArticle, setLastArticle] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);
  const [ended, setEnded] = useState(false);
  const [getMore, { isLoading: isLoadingMore }] = useGetSocialMoreMutation();
  const onScrollSocialContent = async (e) => {
    const top = Math.round((e.target.scrollTop + e.target.clientHeight) / 10);
    const height = parseInt(e.target.scrollHeight / 10);
    dispatch(setOnAction({ type: 'top', value: e.target.scrollTop }));
    if (
      top >= height &&
      Object.keys(lastArticle).length !== 0 &&
      !isLoadingMore &&
      !ended
    ) {
      try {
        setComment(0);
        const response = await getMore({
          ...lastArticle,
          limit: process.env.POST_LIMIT || 10,
          filter,
        }).unwrap();
        if (response.length === 0) {
          setEnded(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const wheelFlag = useRef(0);
  const refreshTimer = useRef(null);
  const onWheelSocialContent = (e) => {
    if (!scrollRef.current) return;
    if (refreshTimer.current) return;

    const top = scrollRef.current.scrollTop;
    if (top === 0 && e.deltaY < 0) {
      if (wheelFlag.current > 3) {
        setComment(0);
        setIsRefresh(true);
        refreshTimer.current = setTimeout(() => {
          try {
            refetch();
            setIsRefresh(false);
            wheelFlag.current = 0;
            refreshTimer.current = null;
          } catch (error) {
            console.error(error);
          }
        }, 1000);
      }
      wheelFlag.current++;
    }
  };

  let refresh;
  if (isRefresh || isFetching) {
    refresh = <Spinner className="refresh-content" color="#0c0c0c" />;
  }
  let content = [];
  if (isSuccess && !isFetching) {
    content = articles.map((article) => (
      <SocialArticle
        key={article.id}
        scrollRef={scrollRef}
        ids={lastArticle.ids}
        data={article}
        comment={comment}
        setComment={setComment}
      />
    ));
  }

  let loading;
  if (isLoadingMore) {
    loading = <Spinner className="last-content" color="#0c0c0c" />;
  }

  let endContent;
  if (ended) {
    const src = `${process.env.SERVER_URL}/img/common/tikitaka.png`;
    endContent = (
      <div className="last-content">
        <img src={src} alt="tikitaka" width="100px" />
        <h4>End of Content</h4>
        <p>Copyright. @seo.dev</p>
      </div>
    );
  }

  useEffect(() => {
    if (articles && articles.length !== 0) {
      setLastArticle({
        ids: articles.map((v) => v.id),
        modified: articles[articles.length - 1].modified,
      });
    }
  }, [articles]);

  useEffect(() => {
    setEnded(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [filter]);

  useLayoutEffect(() => {
    if (onAction) {
      if (onAction.refresh) {
        refetch();
        scrollRef.current ? (scrollRef.current.scrollTop = 0) : '';
        dispatch(setOnAction({ type: 'refresh', value: false }));
      }
      if (onAction.onTop) {
        scrollRef.current
          ? scrollRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          : '';
        dispatch(setOnAction({ type: 'onTop', value: false }));
      }
    }
  }, [onAction]);

  useEffect(() => {
    return () => {
      dispatch(setOnAction({ type: 'top', value: 0 }));
    };
  }, []);

  return (
    <>
      <section
        className={`social-box-content scroll-none ${
          comment ? 'comment-active' : ''
        }`}
        ref={scrollRef}
        onScroll={onScrollSocialContent}
        onWheel={onWheelSocialContent}
      >
        {refresh}
        {useMemo(() => content, [articles, comment, lastArticle])}
        {loading}
        {endContent}
      </section>
    </>
  );
};

export default SocialContent;
