import React, { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetMenuQuery } from '../features/chat/chatApiSlice';
import Menu from './Menu';
import Profile from './Profile';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRightFromBracket,
  faGear,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBell,
  faCircleUser,
  faComments,
} from '@fortawesome/free-regular-svg-icons';
import { useLogoutMutation } from '../features/login/loginApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreator, logout } from '../features/login/loginReducer';
import useNotification from '../hooks/useNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setViewPort } from '../features/social/socialReducer';

library.add(faGear, faComments, faUsers, faCircleUser, faBell);

const Navbar = () => {
  const userInfo = useSelector(selectCreator);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { data: menus, isSuccess } = useGetMenuQuery();

  let menuContent;
  if (isSuccess) {
    menuContent = menus.map((menu) => {
      if (!menu.show) return;
      const selected = pathname.indexOf(menu.url) !== -1 ? true : false;
      return <Menu key={menu.id} menu={menu} selected={selected} />;
    });
  }

  const onClickProfile = () => {
    navigator('/settings');
  };

  const [logoutProcess] = useLogoutMutation();
  const { unSubscribe } = useNotification(userInfo.id);
  const onClickLogout = async () => {
    try {
      dispatch(logout());
      await logoutProcess();
      unSubscribe();
      navigator('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const [viewWidth, setViewWidth] = useState(window.visualViewport.width);
  useLayoutEffect(() => {
    const resizeListener = () => {
      setViewWidth(window.visualViewport.width);
      dispatch(
        setViewPort({
          width: window.visualViewport.width,
          height: window.visualViewport.height,
        })
      );
    };
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return (
    <section className="navbar">
      <div
        className="logo-box"
        onClick={() => {
          navigator('/');
        }}
      >
        <img
          src={`${process.env.SERVER_URL}/img/common/${
            viewWidth > 1000 ? 'tikitaka.png' : 'tikitaka-mini.png'
          }`}
          alt="logo"
        />
      </div>
      <div className="menu-box">{menuContent}</div>
      <div className="profile-box">
        <Profile
          className="profile btn-effect"
          type={userInfo.type}
          profile={userInfo.profile}
          onClick={onClickProfile}
        />

        {viewWidth > 1000 ? (
          <div className="vertical-middle">
            <p>{userInfo.nick}</p>
            <button className="bg-transparent bd-none" onClick={onClickLogout}>
              Logout
            </button>
          </div>
        ) : viewWidth > 540 ? (
          <button className="bg-transparent bd-none" onClick={onClickLogout}>
            Logout
          </button>
        ) : (
          <FontAwesomeIcon
            className="logout-button btn-effect"
            icon={faArrowRightFromBracket}
            onClick={onClickLogout}
          />
        )}
      </div>
    </section>
  );
};

export default Navbar;
