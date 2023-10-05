import React from "react";
import styled from "styled-components";
import { Header, InnerBox, Paragraph } from "../../../components/Styled";

const ResponseInnerBox = styled(InnerBox)`
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Title = styled(Header)`
  position: absolute;
  top: 30px;
  right: 50px;
`;

const DescriptionBox = styled.div`
  padding: 30px;
  position: absolute;
  bottom: 0;
  width: 80%;
`;

const Description = styled(Paragraph)`
  margin-top: 20px;
`;

const LoginImageSection = () => {
  return (
    <>
      <ResponseInnerBox position="relative" width="50%">
        <Img
          src={`${process.env.SERVER_URL}/img/common/login_main.jpg`}
          alt="login_main_image"
        />
        <Title fontFamily="DancingScript" fontSize="4rem" color="#fff">
          TikiTaka
        </Title>
        <DescriptionBox>
          <Header fontFamily="DancingScript" fontSize="3rem" color="#fff">
            Chat
          </Header>
          <Description
            fontFamily="DancingScript"
            fontSize="1.5rem"
            color="#fff"
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum
            est, nihil iusto, eaque sint distinctio,
          </Description>
        </DescriptionBox>
      </ResponseInnerBox>
    </>
  );
};

export default LoginImageSection;
