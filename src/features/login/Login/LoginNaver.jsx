const LoginNaver = ({ setPopup }) => {
  const client_id = 'Qcr2XObeqIPO6r12YulM';

  const onClickNaver = () => {
    const redirect_uri = `${process.env.SERVER_URL}/auth/callback/naver`;
    const naver_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=seodev`;
    const popup = window.open(
      naver_url,
      'Naver Login',
      'width=500,height=400,left=0,top=0'
    );
    setPopup(popup);
  };

  return (
    <>
      <button className="naver button btn-effect" onClick={onClickNaver}>
        <img
          src={`${process.env.SERVER_URL}/img/common/naver.png`}
          alt="naver"
          width="40px"
          height="40px"
        />
      </button>
    </>
  );
};

export default LoginNaver;
