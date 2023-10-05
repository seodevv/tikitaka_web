import { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  FlexBox,
  FlexGrowBox,
  InnerBox,
  Input,
  Label,
} from "../../../components/Styled";

const Forgot = styled(Button)`
  font-size: 0.8rem;
  font-weight: bold;
  background: transparent;
  border: none;
`;

const LoginAddOns = ({ remember, setRemember }) => {
  const onChangeRemember = (e) => setRemember(e.target.checked);

  const onClickForgot = () => {};

  useLayoutEffect(() => {
    const rememberId = localStorage.getItem("rememberId");
    if (rememberId) {
      setRemember(true);
    }
  }, []);

  return (
    <>
      <FlexBox marginTop="20px" wrap="nowrap">
        <InnerBox padding="0 5px">
          <Input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={onChangeRemember}
            transform="scale(1.5)"
            verticalAlign="middle"
          />
          <Label
            htmlFor="remember"
            marginLeft="10px"
            fontSize="0.9rem"
            fontWeight="bold"
          >
            Remember me
          </Label>
        </InnerBox>
        <FlexGrowBox />
        <InnerBox padding="0 5px">
          <Forgot type="button" onClick={onClickForgot}>
            Forgot Password
          </Forgot>
        </InnerBox>
      </FlexBox>
    </>
  );
};

export default LoginAddOns;
