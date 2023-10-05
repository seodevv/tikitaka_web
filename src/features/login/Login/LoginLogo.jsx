import styled from "styled-components";

const Section = styled.section`
  display: block;
  width: 100%;
`;

const LoginLogo = () => {
  return (
    <Section>
      <img
        src={`${process.env.SERVER_URL}/img/common/tikitaka.png`}
        alt="logo"
        width="150px"
      />
    </Section>
  );
};

export default LoginLogo;
