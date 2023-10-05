import { useEffect, useState } from 'react';
import { Box, Input, Label, Error } from '../../../components/Styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useGetDuplicatedMutation } from '../loginApiSlice';
import styled from 'styled-components';

const MobileInput = styled(Input)`
  @media screen and (max-width: 540px) {
    border: 1px solid #aaa;
  }
`;

const SignUpEmailInput = ({ idStatus, setIdStatus }) => {
  const [id, setId] = useState('');
  const [checkId, setCheckId] = useState(false);
  const [duplicated, setDuplicated] = useState('idle');
  const onChangeId = (e) => {
    setId(e.target.value);
    setDuplicated('idle');
    const regex =
      /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
    if (regex.test(e.target.value)) {
      setCheckId(true);
    } else {
      setCheckId(false);
    }
  };

  const [getDuplicated, { isLoading }] = useGetDuplicatedMutation();
  const onBlurId = async () => {
    if (id.length !== 0 && checkId && duplicated === 'idle') {
      try {
        const result = await getDuplicated(id).unwrap();
        if (!result.duplicate) {
          setDuplicated('success');
        } else {
          setDuplicated('failed');
        }
      } catch (error) {
        console.error(error);
        setDuplicated('error');
      }
    }
  };

  useEffect(() => {
    if (idStatus) {
      setId(idStatus);
      setCheckId(true);
      setDuplicated('success');
    }
  }, []);

  useEffect(() => {
    if (checkId && duplicated === 'success') {
      setIdStatus(id);
    } else {
      setIdStatus('');
    }
  }, [checkId, duplicated]);

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
      <Box position="relative">
        <MobileInput
          type="text"
          id="id"
          placeholder="Enter your email"
          value={id}
          onChange={onChangeId}
          onBlur={onBlurId}
          autoComplete="off"
          marginTop="10px"
          padding="10px 30px"
          width="100%"
        />
        <Box
          position="absolute"
          top="60%"
          right="15px"
          transform="translateY(-50%)"
        >
          {isLoading && <FontAwesomeIcon icon={faSpinner} spinPulse />}
          {duplicated === 'success' ? (
            <FontAwesomeIcon
              icon={faCheck}
              size="lg"
              style={{ color: '#1e7b24' }}
            />
          ) : (
            duplicated === 'failed' && (
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                style={{ color: '#cb1515' }}
              />
            )
          )}
        </Box>
      </Box>
      {duplicated === 'failed' ? (
        <Error>Email is duplicated. Please enter again.</Error>
      ) : (
        duplicated === 'error' && <Error>Server error. Please try again</Error>
      )}
      {id.length === 0
        ? null
        : !checkId && <Error>Please follow the mail format.</Error>}
    </>
  );
};

export default SignUpEmailInput;
