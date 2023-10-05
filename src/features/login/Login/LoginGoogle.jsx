import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useOauthLoginMutation } from '../loginApiSlice';
import { useNavigate } from 'react-router-dom';

const LoginGoogle = ({ setIsLoading, setIsFailed, setFailedMessage }) => {
  const navigator = useNavigate();
  const [googleLogin] = useOauthLoginMutation();
  const googleLoginProcess = async (tokenResponse) => {
    try {
      setIsLoading(true);
      const result = await googleLogin({
        token: tokenResponse.access_token,
        type: 'google',
      }).unwrap();
      // sessionStorage.setItem('userInfo', JSON.stringify(result.userInfo));
      navigator('/');
    } catch (error) {
      setIsLoading(false);
      setIsFailed('Login Failed');
      setFailedMessage('[Server error] Please try again.');
      console.error(error);
    }
  };

  const onClickGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => googleLoginProcess(tokenResponse),
    onError: (error) => {
      setIsFailed('Login Failed');
      setFailedMessage('[Server error] Please try again.');
      console.error(error);
    },
    flow: 'implicit',
  });

  return (
    <>
      <GoogleOAuthProvider
        clientId={
          process.env.OAUTH_GOOGLE_CLIENT_ID ||
          '984239734284-247u46nsg99v73c843agb1jipdlv2qm2.apps.googleusercontent.com'
        }
      >
        <button
          className="google button btn-effect"
          type="button"
          onClick={() => onClickGoogle()}
        >
          <img
            src={`${process.env.SERVER_URL}/img/common/google.png`}
            alt="google"
            width="30px"
            height="30px"
          />
        </button>
      </GoogleOAuthProvider>
    </>
  );
};

export default LoginGoogle;
