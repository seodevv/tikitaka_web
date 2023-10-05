import styled, { css } from "styled-components";

const GlobalStyle = css`
  margin: ${({ margin }) => (margin ? margin : "0")};
  margin-top: ${({ marginTop }) => marginTop && marginTop};
  margin-right: ${({ marginRight }) => marginRight && marginRight};
  margin-bottom: ${({ marginBottom }) => marginBottom && marginBottom};
  margin-left: ${({ marginLeft }) => marginLeft && marginLeft};
  padding: ${({ padding }) => (padding ? padding : "0")};
  padding-top: ${({ paddingTop }) => paddingTop && paddingTop};
  padding-right: ${({ paddingRight }) => paddingRight && paddingRight};
  padding-bottom: ${({ paddingBottom }) => paddingBottom && paddingBottom};
  padding-left: ${({ paddingLeft }) => paddingLeft && paddingLeft};
  display: ${({ display }) => display && display};
  width: ${({ width }) => width && width};
  max-width: ${({ maxWidth }) => maxWidth && maxWidth};
  height: ${({ height }) => height && height};
  max-height: ${({ maxHeight }) => maxHeight && maxHeight};
  background: ${({ background }) => background && background};
  position: ${({ position }) => position && position};
  top: ${({ top }) => top && top};
  right: ${({ right }) => right && right};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left && left};
  z-index: ${({ zIndex }) => zIndex && zIndex};
  font-family: ${({ fontFamily }) => fontFamily && fontFamily};
  font-size: ${({ fontSize }) => fontSize && fontSize};
  color: ${({ color }) => color && color};
  letter-spacing: ${({ letterSpacing }) => letterSpacing && letterSpacing};
  text-align: ${({ textAlign }) => textAlign && textAlign};
  border: ${({ border }) => border && border};
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  cursor: ${({ cursor }) => cursor && cursor};
  transform: ${({ transform }) => transform && transform};
  vertical-align: ${({ verticalAlign }) => verticalAlign && verticalAlign};
`;

export const Box = styled.div`
  ${GlobalStyle}
`;

export const FlexBox = styled.div`
  ${GlobalStyle}
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  flex-wrap: ${(props) => props.wrap || "wrap"};
`;

export const FlexGrowBox = styled.div`
  flex-grow: 1;
`;

export const InnerBox = styled.section`
  ${GlobalStyle}
`;

export const Container = styled.div`
  ${GlobalStyle}
`;

export const Header = styled.h1`
  ${GlobalStyle}
`;

export const Paragraph = styled.p`
  ${GlobalStyle}
`;

export const Form = styled.form`
  ${GlobalStyle}
`;

export const Label = styled.label`
  ${GlobalStyle}
`;

export const Input = styled.input`
  ${GlobalStyle}
  font-size: 1.1rem;
`;

export const Button = styled.button`
  ${GlobalStyle}
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
  cursor: pointer;

  &:hover {
    filter: brightness(90%);
  }
  &:active {
    filter: brightness(80%);
  }
  &:disabled {
    filter: opacity(0.5);
  }
`;

export const Error = styled(Paragraph)`
  margin: 5px;
  color: red;
  font-size: 0.9rem;
`;

export const MainContainer = styled(Container)``;
