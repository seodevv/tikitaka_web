import KakaoLogin from 'react-kakao-login';
import { useOauthLoginMutation } from '../loginApiSlice';
import { useNavigate } from 'react-router-dom';

const LoginKakao = ({ setIsLoading, setIsFailed, setFailedMessage }) => {
  const navigator = useNavigate();
  const [kakaoLogin] = useOauthLoginMutation();
  const onSuccessKakao = async ({ response }) => {
    try {
      setIsLoading(true);
      await kakaoLogin({
        token: response.access_token,
        type: 'kakao',
      }).unwrap();
      navigator('/');
    } catch (error) {
      setIsLoading(false);
      setIsFailed('Login Failed');
      setFailedMessage('[Server error] Please try again.');
      console.error(error);
    }
  };
  const onFailKakao = (error) => {
    setIsFailed('Login Failed');
    setFailedMessage('[Server error] Please try again.');
    console.error(error);
  };

  return (
    <>
      <KakaoLogin
        token={
          process.env.OAUTH_KAKAO_CLIENT_ID ||
          'a641b6bf48f74b925c14f3efde19f7e7'
        }
        onSuccess={onSuccessKakao}
        onFail={onFailKakao}
        render={({ onClick }) => (
          <button className="kakao button btn-effect" onClick={onClick}>
            <img
              src={`${process.env.SERVER_URL}/img/common/kakao.png`}
              alt="kakao"
              width="40px"
              height="40px"
            />
          </button>
        )}
      />
    </>
  );
};

export default LoginKakao;
