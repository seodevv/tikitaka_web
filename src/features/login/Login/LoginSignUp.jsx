import { useNavigate } from 'react-router-dom';
import { Button, Paragraph } from '../../../components/Styled';
import styled from 'styled-components';

const MobileParagraph = styled(Paragraph)`
  @media screen and (max-width: 540px) {
    margin: 15px 0;
  }
`;

const LoginSignUp = () => {
  const navigator = useNavigate();
  const onClickSignup = () => {
    navigator('/login/signup');
  };
  return (
    <>
      <MobileParagraph marginTop="50px" textAlign="center" color="#797979">
        Don't have an account?
        <Button
          type="button"
          onClick={onClickSignup}
          marginLeft="10px"
          background="transparent"
          fontFamily="Freehand"
          border="none"
        >
          Sign up
        </Button>
      </MobileParagraph>
    </>
  );
};

export default LoginSignUp;
