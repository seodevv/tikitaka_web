import { useEffect, useRef, useState } from 'react';
import { Box, Button, Error, Input, Label } from '../../../components/Styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAddUserMutation, useSendAuthCodeMutation } from '../loginApiSlice';
import CryptoJS from 'crypto-js';
import Timer from '../../../components/Timer';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MobileLabel = styled(Label)`
  @media screen and (max-width: 540px) {
    margin-top: 20px;
  }
`;

const SignUpOTPInput = ({
  idStatus,
  passwordStatus,
  setIsLoading,
  setIsFailed,
  setFailedMessage,
}) => {
  const [code, setCode] = useState('');
  const codeRef = useRef(null);
  const onChangeCode = (e) => {
    codeRef.current.classList.remove('wrong-code');
    setCode(e.target.value);
    setUnCorrect(false);
    setMessage('');
  };

  const [authCode, setAuthCode] = useState('');
  const [time, setTime] = useState(0);
  const timer = useRef(null);
  const [sendAuthCode, { isLoading, isError }] = useSendAuthCodeMutation();
  const [message, setMessage] = useState('');
  const [unCorrect, setUnCorrect] = useState(false);
  const onClickSendCode = async (e) => {
    e.preventDefault();
    if (timer.current) {
      clearInterval(timer.current);
    }
    try {
      setCode('');
      setAuthCode('');
      const result = await sendAuthCode({
        type: 'signup',
        target: idStatus,
      }).unwrap();
      setAuthCode(
        CryptoJS.AES.decrypt(
          result.code,
          process.env.CRYPTO_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
      );
      setTime(180);
      setUnCorrect(false);
      setMessage(`${idStatus} 로 인증 메일이 전송되었습니다.`);
      if (codeRef.current) {
        codeRef.current.focus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const canSignUp = code && authCode && time > 0;
  const [addUser] = useAddUserMutation();
  const navigator = useNavigate();
  const signUpProcess = async () => {
    if (code === authCode) {
      clearInterval(timer.current);
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordStatus,
        process.env.CRYPTO_SECRET_KEY
      ).toString();
      try {
        setIsLoading(true);
        await addUser({
          id: idStatus,
          password: encryptedPassword,
        }).unwrap();
        setIsLoading(false);
        navigator('/login');
      } catch (error) {
        setIsLoading(false);
        setAuthCode('');
        setIsFailed('Server Error');
        setFailedMessage('Please try again');
        console.error(error);
      }
    } else {
      setMessage('인증 코드가 틀립니다.');
      setUnCorrect(true);
      if (codeRef.current) {
        codeRef.current.classList.remove('wrong-code');
        codeRef.current.offsetWidth;
        codeRef.current.classList.add('wrong-code');
        codeRef.current.focus();
      }
    }
  };
  const onClickSignUp = () => {
    signUpProcess();
  };
  const onKeyDownSignUp = (e) => {
    if (canSignUp && e.keyCode === 13) {
      signUpProcess();
    }
  };

  useEffect(() => {
    // console.log(time);
    if (time === 180) {
      timer.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, [1000]);
    } else if (time === 0) {
      setCode('');
      setAuthCode('');
      clearInterval(timer.current);
    }
  }, [time]);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <>
      <MobileLabel
        htmlFor="emailAuth"
        marginTop="130px"
        display="block"
        fontWeight="bold"
        letterSpacing="1px"
      >
        Email Authentication
      </MobileLabel>
      <Box position="relative">
        <Input
          type="text"
          ref={codeRef}
          id="emailAuth"
          placeholder="authentication code"
          value={code}
          onChange={onChangeCode}
          onKeyDown={onKeyDownSignUp}
          autoComplete="off"
          marginTop="10px"
          padding="10px 30px"
          width="100%"
          border="1px solid #aaa"
        />
        <Box
          position="absolute"
          top="60%"
          right="15px"
          transform="translateY(-50%)"
        >
          {!isLoading ? (
            <div className="p-relative">
              <button
                className="bd-none bg-transparent"
                onClick={onClickSendCode}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  size="lg"
                  color="#296eff"
                />
              </button>
              {!authCode && (
                <div className="balloon-container">
                  <div className="balloon">Click!</div>
                </div>
              )}
            </div>
          ) : (
            <FontAwesomeIcon icon={faSpinner} spinPulse />
          )}
        </Box>
      </Box>
      {isError && <Error>Server Error. please try again</Error>}
      {authCode && (
        <>
          <p className={`send-info ${unCorrect ? 'uncorrect' : ''}`}>
            {message}
          </p>
          <p className="send-info smaller">
            만약, 인증 코드를 받지 못했다면,&nbsp;
            <FontAwesomeIcon icon={faPaperPlane} color="#296eff" />
            &nbsp;을 클릭해주세요.
          </p>
          <Timer time={time} />
        </>
      )}
      <Button
        type="button"
        onClick={onClickSignUp}
        marginTop="30px"
        padding="15px"
        color="#fff"
        background="#000"
        border="none"
        width="100%"
        fontFamily="Freehand"
        disabled={!canSignUp}
      >
        Sign Up
      </Button>
    </>
  );
};

export default SignUpOTPInput;
