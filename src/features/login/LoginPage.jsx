import '../../css/login.css';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginSection from './Login/LoginSection';
import LoginImageSection from './ImageSection/LoginImageSection';
import { Container, FlexBox } from '../../components/Styled';
import { useGetUserInfoQuery } from './loginApiSlice';

const FixedContainer = styled(Container)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px black;

  @media screen and (max-width: 540px) {
    width: 100dvw;
    height: 100dvh;
  }
`;

const MobileFlexBox = styled(FlexBox)`
  @media screen and (max-width: 540px) {
    align-items: center;
    width: 100dvw;
    height: 100dvh;
  }
`;

const LoginPage = () => {
  const navigator = useNavigate();
  const { data: userInfo, isSuccess, refetch } = useGetUserInfoQuery();

  useLayoutEffect(() => {
    if (userInfo) {
      if (isSuccess && userInfo.success) {
        navigator('/');
      }
    }
  }, [userInfo]);

  return (
    <>
      <FixedContainer width="90%" maxWidth="1024px" border="none">
        <MobileFlexBox direction="row" wrap="nowrap" width="100%">
          <LoginSection refetch={refetch} />
          <LoginImageSection />
        </MobileFlexBox>
      </FixedContainer>
    </>
  );
};

export default LoginPage;
