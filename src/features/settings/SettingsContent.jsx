import { useEffect, useRef, useState } from 'react';
import Profile from '../../components/Profile';
import { useEditProfileMutation } from './SettingsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { editUserInfo, selectCreator } from '../login/loginReducer';
import SettingsType from './Table/SettingsType';
import SettingsEmail from './Table/SettingsEmail';
import SettingsNick from './Table/SettingsNick';
import SettingsBirth from './Table/SettingsBirth';
import SettingsRegist from './Table/SettingsRegist';

const SettingsContent = () => {
  const userInfo = useSelector(selectCreator);
  const dispatch = useDispatch();

  const [image, setImage] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const errorTimer = useRef(null);

  useEffect(() => {
    if (errorMessage) {
      errorTimer.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const [email, setEmail] = useState('idle');
  const [nick, setNick] = useState('idle');
  const [birth, setBirth] = useState('idle');

  const canConfirm =
    !(
      email === 'idle' &&
      nick === 'idle' &&
      birth === 'idle' &&
      image === 'idle'
    ) && !(email === 'block' || nick === 'block');

  const [editProfile] = useEditProfileMutation();
  const onClickConfirm = async () => {
    console.log('confirm', email, nick, birth, image);
    const formData = new FormData();
    formData.append('type', 'profile');
    formData.append('id', userInfo.id);
    formData.append('email', email !== 'idle' ? email : '');
    formData.append('nick', nick !== 'idle' ? nick : '');
    formData.append('birth', birth !== 'idle' ? birth : '');
    formData.append('profile', image);
    try {
      const response = await editProfile(formData).unwrap();
      dispatch(editUserInfo(response.userInfo));
      setEmail('reset');
      setNick('reset');
      setBirth('reset');
    } catch (error) {
      console.error(error);
    }
  };

  const onClickCancle = () => {
    setEmail('reset');
    setNick('reset');
    setBirth('reset');
  };

  return (
    <>
      <div className="settings-box-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Profile
          className="profile"
          type={userInfo.type}
          profile={userInfo.profile}
          edit
          setStatus={setImage}
          setMessage={setErrorMessage}
        />
        <table className="settings-table">
          <tbody>
            <SettingsType userInfo={userInfo} />
            <SettingsEmail
              userInfo={userInfo}
              status={email}
              setStatus={setEmail}
            />
            <SettingsNick
              userInfo={userInfo}
              status={nick}
              setStatus={setNick}
            />
            <SettingsBirth
              userInfo={userInfo}
              status={birth}
              setStatus={setBirth}
            />
            <SettingsRegist userInfo={userInfo} />
          </tbody>
        </table>
        <div className="settings-confirm">
          <button
            className="button confirm btn-effect"
            onClick={onClickConfirm}
            disabled={!canConfirm}
          >
            Confirm
          </button>
          <button className="button cancle btn-effect" onClick={onClickCancle}>
            Cancle
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsContent;
