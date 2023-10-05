const Tag = ({ className, style, onClick, children }) => {
  return (
    <>
      <a className={className} style={style} onClick={onClick}>
        #{children}
      </a>
    </>
  );
};

export default Tag;
