const LoginGithub = ({ setPopup }) => {
  const client_id = 'Iv1.e9ffbb9ff07c1f0f';

  const onClickGithubLogin = () => {
    const redirect_url = `${process.env.SERVER_URL}/auth/callback/github`;
    const github_url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}`;
    const popup = window.open(
      github_url,
      'Github Login',
      'width=500,height=400,left=0,top=0'
    );
    setPopup(popup);
  };

  return (
    <>
      <button className="naver button btn-effect" onClick={onClickGithubLogin}>
        <img
          src={`${process.env.SERVER_URL}/img/common/github.png`}
          alt="github"
          width="40px"
          height="40px"
        />
      </button>
    </>
  );
};

export default LoginGithub;
