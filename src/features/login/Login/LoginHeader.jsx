import { Header, Paragraph } from "../../../components/Styled";

const LoginHeader = () => {
  return (
    <>
      <Header
        fontFamily="Freehand"
        fontSize="2rem"
        textAlign="center"
        letterSpacing="0.3rem"
      >
        Welcom back!
      </Header>
      <Paragraph marginTop="10px" color="#777" textAlign="center">
        The faster you fill up, the faster you get a ticket
      </Paragraph>
    </>
  );
};

export default LoginHeader;
