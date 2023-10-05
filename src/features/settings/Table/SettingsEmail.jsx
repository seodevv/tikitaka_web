import { useEffect, useRef, useState } from 'react';
import { useSendAuthCodeMutation } from '../../login/loginApiSlice';
import CryptoJS from 'crypto-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faFaceFrown,
  faFaceGrinWide,
  faFaceLaughSquint,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Timer from '../../../components/Timer';

const SettingsEmail = ({ userInfo, status, setStatus }) => {
  const [email, setEmail] = useState('');

  const [emailFormat, setEmailFormat] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const onChangeEmail = (e) => {
    setEmail(e.target.value);

    if (e.target.value.length === 0) {
      setStatus('idle');
    } else {
      setStatus('block');
    }

    const regex =
      /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
    if (regex.test(e.target.value)) {
      setEmailMessage('클릭하시면 인증 코드를 보냅니다.');
      setEmailFormat(true);
    } else {
      setEmailMessage('형식에 맞게 입력해주세요.');
      setEmailFormat(false);
    }
  };

  const [sendCode] = useSendAuthCodeMutation();
  const [authCode, setAuthCode] = useState('');
  const [time, setTime] = useState(0);
  const timer = useRef(null);
  const xTimer = useRef(null);
  const onClickSendEmailCode = async () => {
    if (timer.current) clearInterval(timer.current);
    if (xTimer.current) clearTimeout(xTimer.current);
    try {
      setAuthCode('');
      setInputCode('');
      setEmailMessage('인증 코드를 보내는 중...');
      const result = await sendCode({ type: 'auth', target: email }).unwrap();
      setEmailMessage('인증 코드를 보냈습니다.');
      xTimer.current = setTimeout(() => {
        setEmailMessage('다시 시도하시려면 X 를 클릭해주세요.');
      }, 5000);
      setAuthCode(
        CryptoJS.AES.decrypt(
          result.code,
          process.env.CRYPTO_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
      );
      setTime(180);
      if (inputCodeRef.current) {
        inputCodeRef.current.focus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (time === 180) {
      timer.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer.current);
      setAuthCode('');
      setEmailMessage('만료 되었습니다. 다시 시도해주세요.');
    }
  }, [time]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const [inputCode, setInputCode] = useState('');
  const inputCodeRef = useRef(null);
  const [correctCode, setCorrectCode] = useState(false);
  const onChangeInputCode = (e) => {
    setInputCode(e.target.value);

    if (e.target.value === authCode) {
      setStatus(email);
      setEmailMessage('이메일이 인증이 완료되었습니다.');
      setCorrectCode(true);
      clearInterval(timer.current);
    } else {
      setCorrectCode(false);
    }
  };

  const onClickReset = () => {
    setAuthCode('');
    setInputCode('');
    setEmailMessage('클릭하시면 인증 코드를 보냅니다.');
    clearTimeout(xTimer.current);
  };

  useEffect(() => {
    if (status === 'reset') {
      setEmail(userInfo.email || '');
      setStatus('idle');
      setEmailMessage('');
      setAuthCode('');
      clearInterval(timer.current);
      setInputCode('');
      setCorrectCode(false);
    }
  }, [status]);

  useEffect(() => {
    if (userInfo.email) {
      setEmail(userInfo.email);
    } else {
      setEmail('');
    }
  }, [userInfo]);

  return (
    <>
      <tr>
        <td>email</td>
        <td>
          <div className="flex-row-no">
            <input
              type="text"
              value={email}
              onChange={onChangeEmail}
              disabled={userInfo.email || authCode ? true : false}
            />
            <button
              className={`settings-email-auth btn-effect ${
                emailFormat ? 'active' : ''
              }`}
              onClick={onClickSendEmailCode}
              disabled={correctCode ? true : !emailFormat}
            >
              {!userInfo.email && email && (
                <div className="balloon-container">
                  <div className="balloon">{emailMessage}</div>
                </div>
              )}
              {userInfo.email ? (
                <FontAwesomeIcon
                  icon={faFaceLaughSquint}
                  size="xl"
                  color="#0084ff"
                />
              ) : (
                <FontAwesomeIcon
                  icon={!emailFormat ? faFaceFrown : faFaceGrinWide}
                  size="xl"
                  color={!emailFormat ? '#e23131' : '#296eff'}
                />
              )}
            </button>
          </div>
        </td>
      </tr>
      {authCode && (
        <tr>
          <td></td>
          <td>
            <div className={`auth-code ${correctCode ? 'correct' : ''}`}>
              <div className="flex-row-no">
                <input
                  type="text"
                  ref={inputCodeRef}
                  value={inputCode}
                  onChange={onChangeInputCode}
                  disabled={correctCode}
                />
                <button
                  className="settings-email-auth btn-effect"
                  onClick={onClickReset}
                  disabled={correctCode}
                >
                  {!correctCode ? (
                    <FontAwesomeIcon icon={faXmark} size="xl" color="#e23131" />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} size="xl" color="#278839" />
                  )}
                </button>
              </div>
              <Timer time={time} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default SettingsEmail;
