import '../../css/main.css';
import React, { memo, useEffect, useLayoutEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { wsConnect, wsDisconnect } from '../websocket/webSocketSlice';
import { initialState, login, logout } from '../login/loginReducer';
import SocialDetail from '../social/detail/SocialDetail';
import SocialModal from '../social/detail/SocialModal';
import {
  closeCreative,
  selectArticle,
  selectCreative,
  selectMessage,
  selectModal,
  setViewPort,
} from '../social/socialReducer';
import SocialCreator from '../social/creator/SocialCreator';
import Alert from '../../components/Alert';
import { useGetUserInfoQuery } from '../login/loginApiSlice';

const MainPage = memo(() => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const creative = useSelector(selectCreative);
  const article = useSelector(selectArticle);
  const modal = useSelector(selectModal);

  const {
    data = initialState,
    isSuccess,
    isFetching,
    isError,
  } = useGetUserInfoQuery();

  useLayoutEffect(() => {
    if (isSuccess && !isFetching && data.success) {
      dispatch(wsConnect(data.userInfo));
      dispatch(login(data.userInfo));
      dispatch(
        setViewPort({
          width: window.visualViewport.width,
          height: window.visualViewport.height,
        })
      );
    } else if ((isSuccess && !isFetching && !data.success) || isError) {
      dispatch(wsDisconnect());
      dispatch(logout());
      navigator('/login');
    }
  }, [data]);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27 && !creative.processing) {
        dispatch(closeCreative());
      }
    };
    if (creative) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [creative]);

  return (
    <div className="main-container">
      {data.userInfo && (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
      {creative.flag && <SocialCreator creative={creative} />}
      {article.flag && (
        <SocialDetail socialId={article.id} socialIds={article.ids} />
      )}
      {modal.flag && (
        <SocialModal
          socialId={modal.id}
          type={modal.type}
          userId={modal.userId}
        />
      )}
      {message.flag && <Alert text={message.message} />}
    </div>
  );
});

export default MainPage;
