import { useState } from 'react';
import { Input, Label } from '../../../components/Styled';

const LoginPasswordInput = ({ setPasswordStatus, onLoginProcess }) => {
  const [password, setPassword] = useState('');
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim()) {
      setPasswordStatus(e.target.value);
    } else {
      setPasswordStatus('');
    }
  };
  const onKeyDownSignIn = (e) => {
    if (
      e.keyCode === 13 &&
      !e.nativeEvent.isComposing &&
      password.length !== 0
    ) {
      onLoginProcess();
    }
  };
  return (
    <>
      <Label
        htmlFor="password"
        marginTop="30px"
        display="block"
        fontWeight="bold"
        letterSpacing="1px"
      >
        Password
      </Label>
      <Input
        type="password"
        id="password"
        placeholder="********"
        value={password}
        onChange={onChangePassword}
        autoComplete="off"
        marginTop="10px"
        padding="10px 30px"
        width="100%"
        border="1px solid #aaa"
        onKeyDown={onKeyDownSignIn}
      />
    </>
  );
};

export default LoginPasswordInput;
