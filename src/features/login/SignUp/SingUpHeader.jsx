import { Header, Paragraph } from "../../../components/Styled";

const SingUpHeader = () => {
  return (
    <>
      <Header
        fontFamily="Freehand"
        fontSize="2rem"
        textAlign="center"
        letterSpacing="0.3rem"
      >
        Sign in
      </Header>
      <Paragraph marginTop="10px" color="#777" textAlign="center">
        Thanks for joining our system.
      </Paragraph>
    </>
  );
};

export default SingUpHeader;
