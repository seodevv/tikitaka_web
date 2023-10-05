import { useEffect, useState } from 'react';
import { Button, Box, InnerBox } from '../../../components/Styled';
import { useNavigate } from 'react-router-dom';
import { useGetComparedMutation } from '../loginApiSlice';
import CryptoJS from 'crypto-js';
import LoginHeader from './LoginHeader';
import LoginEmailInput from './LoginEmailInput';
import LoginPasswordInput from './LoginPasswordInput';
import LoginAddOns from './LoginAddOns';
import LoginSignUp from './LoginSignUp';
import LoginGoogle from './LoginGoogle';
import LoginKakao from './LoginKakao';
import LoginNaver from './LoginNaver';
import LoginGithub from './LoginGithub';
import styled from 'styled-components';

const MobileInnerBox = styled(InnerBox)`
  @media screen and (max-width: 500px) {
    margin: 0;
  }
`;

const MobileBox = styled(Box)`
  @media screen and (max-width: 500px) {
    margin: 15px 0;
    width: 100%;
  }
`;

const LoginContent = ({
  setIsLoading,
  setIsFailed,
  setFailedMessage,
  refetch,
}) => {
  const navigator = useNavigate();

  const [idStatus, setIdStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [remember, setRemember] = useState(false);

  const canLogin = idStatus && passwordStatus;

  const [getCompare] = useGetComparedMutation();
  const onLoginProcess = async () => {
    if (remember) {
      localStorage.setItem('rememberId', idStatus);
    } else {
      localStorage.removeItem('rememberId');
    }

    if (canLogin) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordStatus,
        process.env.CRYPTO_SECRET_KEY
      ).toString();
      try {
        setIsLoading(true);
        const result = await getCompare({
          userId: idStatus,
          password: encryptedPassword,
        }).unwrap();
        if (result.compared) {
          navigator('/');
          return;
        }
        setIsLoading(false);
        setIsFailed('Login Failed');
        if (!result.compared) setFailedMessage('Check you Email / Password.');
      } catch (error) {
        setIsLoading(false);
        setIsFailed('Login Failed');
        setFailedMessage('Server error. please try again.');
        console.error(error);
      }
    }
  };
  const onSubmitSignIn = () => onLoginProcess();

  const [popup, setPopup] = useState();
  useEffect(() => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const type = searchParams.get('type');
    const userInfo = JSON.parse(searchParams.get('userInfo'));
    const already = JSON.parse(searchParams.get('already'));
    const error = JSON.parse(searchParams.get('error'));

    if (type) {
      window.opener.postMessage(
        { userInfo, already, error },
        window.location.origin
      );
    }
  }, []);

  useEffect(() => {
    if (!popup) return;

    const listener = (e) => {
      if (e.origin !== window.location.origin) return;
      const { userInfo, error } = e.data;
      if (userInfo) {
        if (error) {
          setIsFailed('Login Failed');
          setFailedMessage('[Server error] Please try again.');
          return;
        }
        refetch();
        navigator('/');
      }
      popup.close();
      setPopup(null);
    };

    window.addEventListener('message', listener, false);

    return () => {
      window.removeEventListener('message', listener);
      popup.close();
      setPopup(null);
    };
  }, [popup]);

  return (
    <MobileInnerBox
      position="relative"
      width="100%"
      maxWidth="450px"
      margin="auto"
    >
      <MobileBox margin="auto" marginTop="50px" width="90%">
        <LoginHeader />
        <LoginEmailInput setIdStatus={setIdStatus} />
        <LoginPasswordInput
          setPasswordStatus={setPasswordStatus}
          onLoginProcess={onLoginProcess}
        />
        <LoginAddOns remember={remember} setRemember={setRemember} />
        <Button
          type="button"
          onClick={onSubmitSignIn}
          marginTop="30px"
          padding="5px"
          color="#fff"
          background="#000"
          border="none"
          width="100%"
          fontFamily="Freehand"
          disabled={!canLogin}
        >
          Sign In
        </Button>
        <div className="oauth-group flex-row-no flex-justify-center">
          <LoginGoogle
            setIsLoading={setIsLoading}
            setIsFailed={setIsFailed}
            setFailedMessage={setFailedMessage}
          />
          <LoginKakao
            setIsLoading={setIsLoading}
            setIsFailed={setIsFailed}
            setFailedMessage={setFailedMessage}
          />
          <LoginNaver setPopup={setPopup} />
          <LoginGithub setPopup={setPopup} />
        </div>
        <LoginSignUp />
      </MobileBox>
    </MobileInnerBox>
  );
};

export default LoginContent;
