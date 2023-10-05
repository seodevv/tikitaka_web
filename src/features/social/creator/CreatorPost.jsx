import { useSelector } from "react-redux";
import { selectCreator } from "../../login/loginReducer";

const CreatorPost = ({ post }) => {
  const creator = useSelector(selectCreator);
  const nick = creator ? creator.nick : "unknown";
  const isHangle = /[가-힣]/.test(post);

  let content;
  let style;
  if (post === "idle") {
    style = {
      padding: "3px 6px",
      color: "#fff",
      background: "rgba(0,0,0,0.75)",
    };
    content = <span style={{ fontSize: "1rem" }}>내용을 입력해보세요.</span>;
  } else {
    const split = post.split(/\n|\r|\r\n/);
    content = split.map((v, i) => {
      if (i === split.length - 1) {
        return <span key={i}>{v}</span>;
      } else {
        return (
          <span key={i}>
            {v}
            <br />
          </span>
        );
      }
    });
  }

  return (
    <>
      <div className={`post ${isHangle ? "hangle" : ""}`}>
        <button className="nick">{nick}</button>
        &nbsp;
        <div className="d-inline" style={style}>
          {content}
        </div>
      </div>
    </>
  );
};

export default CreatorPost;
