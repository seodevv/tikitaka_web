import { useState } from 'react';
import { Box, Button, InnerBox } from '../../../components/Styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SignUpHeader from './SingUpHeader';
import SignUpEmailInput from './SignUpEmailInput';
import SignUpPasswordInput from './SignUpPasswordInput';
import SignUpOTPInput from './SignUpOTPInput';

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin: 30px 15px 0 15px;
  font-size: 1.7rem;

  @media screen and (max-width: 540px) {
    margin: 0 15px;
  }
`;

const MobileInnerBox = styled(InnerBox)`
  @media screen and (max-width: 540px) {
    margin: 15px 0;
  }
`;

const SignUpContent = ({ setIsLoading, setIsFailed, setFailedMessage }) => {
  const [idStatus, setIdStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  const navigator = useNavigate();
  const canSubmit = idStatus && passwordStatus;

  const onClickBack = () => {
    if (!emailAuth) {
      navigator('/login');
    } else {
      navigator('/login/signup');
      setEmailAuth(false);
    }
  };

  const onSubmitSignIn = async () => {
    if (canSubmit && !emailAuth) {
      setEmailAuth(true);
    }
  };

  const [emailAuth, setEmailAuth] = useState(false);

  return (
    <MobileInnerBox
      position="relative"
      width="100%"
      maxWidth="450px"
      margin="auto"
    >
      <StyledFontAwesomeIcon icon={faArrowLeft} onClick={onClickBack} />
      <Box margin="auto" width="90%">
        {!emailAuth ? (
          <>
            <SignUpHeader />
            <SignUpEmailInput idStatus={idStatus} setIdStatus={setIdStatus} />
            <SignUpPasswordInput setPasswordStatus={setPasswordStatus} />
            <Button
              type="button"
              onClick={onSubmitSignIn}
              marginTop="30px"
              padding="15px"
              color="#fff"
              background="#000"
              border="none"
              width="100%"
              fontFamily="Freehand"
              disabled={!canSubmit}
            >
              Next
            </Button>
          </>
        ) : (
          <SignUpOTPInput
            idStatus={idStatus}
            passwordStatus={passwordStatus}
            setIsLoading={setIsLoading}
            setIsFailed={setIsFailed}
            setFailedMessage={setFailedMessage}
          />
        )}
      </Box>
    </MobileInnerBox>
  );
};

export default SignUpContent;
