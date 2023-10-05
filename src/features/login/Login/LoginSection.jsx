import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import LoginLogo from './LoginLogo';
import LoginContent from './LoginContent';
import SignUpContent from '../SignUp/SignUpContent';
import {
  Box,
  Button,
  Container,
  Error,
  Header,
  InnerBox,
} from '../../../components/Styled';

const ResponseInnerBox = styled(InnerBox)`
  padding: 30px;
  position: relative;
  width: 50%;
  height: 700px;
  background: #fff;

  @media screen and (max-width: 1000px) {
    padding: 15px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: 100dvw;
  }
`;

const AbsoluteBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 255;
  background: rgba(0, 0, 0, 0.75);
`;

const StyledSpinner = styled(FontAwesomeIcon)`
  display: block;
  position: absolute;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #fff;
`;

const LoginSection = ({ refetch }) => {
  const { signup } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState('');
  const [failedMessage, setFailedMessage] = useState('');

  let content;
  if (!signup) {
    content = (
      <LoginContent
        setIsLoading={setIsLoading}
        setIsFailed={setIsFailed}
        setFailedMessage={setFailedMessage}
        refetch={refetch}
      />
    );
  } else {
    content = (
      <SignUpContent
        setIsLoading={setIsLoading}
        setIsFailed={setIsFailed}
        setFailedMessage={setFailedMessage}
      />
    );
  }

  const onClickClose = useCallback(() => {
    setIsFailed('');
  });
  const onKeyDownClose = useCallback((e) => {
    if (e.keyCode === 27 && isFailed) {
      setIsFailed('');
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDownClose);
    return () => {
      window.removeEventListener('keydown', onKeyDownClose);
    };
  }, [isFailed]);

  return (
    <ResponseInnerBox>
      {isLoading && (
        <AbsoluteBox width="100%" height="100%">
          <StyledSpinner icon={faSpinner} spinPulse />
        </AbsoluteBox>
      )}
      {isFailed && (
        <AbsoluteBox width="100%" height="100%">
          <Container
            padding="15px"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="50%"
            background="#fff"
            textAlign="center"
            borderRadius="5px"
          >
            <Button
              padding="5px"
              position="absolute"
              top="5px"
              right="5px"
              background="transparent"
              border="none"
              onClick={onClickClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Header>{isFailed}</Header>
            <Error>{failedMessage}</Error>
          </Container>
        </AbsoluteBox>
      )}
      <LoginLogo />
      {content}
    </ResponseInnerBox>
  );
};

export default LoginSection;
