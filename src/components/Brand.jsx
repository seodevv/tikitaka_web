const Brand = ({ className, type }) => {
  let imgSrc = `${process.env.SERVER_URL}/img/common/`;
  switch (type) {
    case "App":
      imgSrc += "tikitaka-mini.png";
      break;
    case "google":
      imgSrc += "google.png";
      break;
    case "kakao":
      imgSrc += "kakao.png";
      break;
    case "naver":
      imgSrc += "naver.png";
      break;
    case "github":
      imgSrc += "github.png";
      break;
  }
  return (
    <>
      <img className={className} src={imgSrc} alt={type} />
    </>
  );
};

export default Brand;
