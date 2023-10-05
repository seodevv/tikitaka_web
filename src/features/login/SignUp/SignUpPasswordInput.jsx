import { useEffect, useState } from 'react';
import { Error, Input, Label } from '../../../components/Styled';
import styled from 'styled-components';

const MobileInput = styled(Input)`
  @media screen and (max-width: 540px) {
    border: 1px solid #aaa;
  }
`;

const SignUpPasswordInput = ({ setPasswordStatus }) => {
  const [password_1, setPassword_1] = useState('');
  const [password_2, setPassword_2] = useState('');
  const [password_1_Check, setPasswordCheck_1] = useState(false);
  const [password_2_Check, setPasswordCheck_2] = useState(false);

  const onChangePassword_1 = (e) => {
    setPassword_1(e.target.value);
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d\.$@$!%*?&]{8,}/;
    if (regex.test(e.target.value)) {
      setPasswordCheck_1(true);
    } else {
      setPasswordCheck_1(false);
    }
  };
  const onChangePassword_2 = (e) => {
    setPassword_2(e.target.value);
    if (password_1 !== e.target.value) {
      setPasswordCheck_2(false);
    } else {
      setPasswordCheck_2(true);
    }
  };

  useEffect(() => {
    if (password_1_Check && password_2_Check) {
      setPasswordStatus(password_1);
    } else {
      setPasswordStatus('');
    }
  }, [password_1_Check, password_2_Check]);

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
      <MobileInput
        type="password"
        id="password"
        placeholder="********"
        value={password_1}
        onChange={onChangePassword_1}
        autoComplete="off"
        marginTop="10px"
        padding="10px 30px"
        width="100%"
      />
      {password_1.length === 0
        ? null
        : !password_1_Check && (
            <Error>
              Requires 1 uppercase letter, 1 number and 1 special character.
            </Error>
          )}
      <MobileInput
        type="password"
        placeholder="********"
        value={password_2}
        onChange={onChangePassword_2}
        autoComplete="off"
        marginTop="10px"
        padding="10px 30px"
        width="100%"
      />
      {password_2.length === 0
        ? null
        : !password_2_Check && <Error>Please check password.</Error>}
    </>
  );
};

export default SignUpPasswordInput;
