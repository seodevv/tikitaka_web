import { useLayoutEffect, useState } from 'react';
import { Input, Label } from '../../../components/Styled';

const LoginEmailInput = ({ setIdStatus }) => {
  const [id, setId] = useState('');
  const onChangeId = (e) => {
    setId(e.target.value);
    if (e.target.value.trim()) {
      setIdStatus(e.target.value);
    } else {
      setIdStatus('');
    }
  };

  useLayoutEffect(() => {
    const rememberId = localStorage.getItem('rememberId');
    if (rememberId) {
      setId(rememberId);
      setIdStatus(rememberId);
    }
  }, []);

  return (
    <>
      <Label
        htmlFor="id"
        marginTop="30px"
        display="block"
        fontWeight="bold"
        letterSpacing="1px"
      >
        Email
      </Label>
      <Input
        type="text"
        id="id"
        placeholder="Enter your email"
        value={id}
        onChange={onChangeId}
        autoComplete="off"
        marginTop="10px"
        padding="10px 30px"
        width="100%"
        border="1px solid #aaa"
      />
    </>
  );
};

export default LoginEmailInput;
