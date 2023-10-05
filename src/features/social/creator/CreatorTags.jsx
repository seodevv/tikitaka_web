import Tag from "../../../components/Tag";

const CreatorTags = ({ tags }) => {
  let content;
  let style;
  if (tags === "idle") {
    style = {
      padding: "3px 6px",
      color: "#fff",
      background: "rgba(0,0,0,0.75)",
      filter: "unset",
    };
    content = (
      <Tag className="hangle" style={style}>
        태그를 추가해보세요.
      </Tag>
    );
  } else {
    const split = tags.split(",");
    content = split.map((tag, i) => {
      const isHangle = /[가-힣]/.test(tag);
      if (tag.length === 0) return;
      return (
        <Tag key={i} className={isHangle ? "hangle" : ""}>
          {tag}
        </Tag>
      );
    });
  }

  return (
    <>
      <div className="tags">{content}</div>
    </>
  );
};

export default CreatorTags;
