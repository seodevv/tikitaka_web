import { memo } from 'react';
import Tag from '../../../components/Tag';
import { useDispatch } from 'react-redux';
import { addFilter } from '../socialReducer';

const ArticleTags = memo(({ tags }) => {
  const dispatch = useDispatch();

  let content;
  const onClickAddFilter = (tag) => {
    dispatch(addFilter({ type: 'tag', value: tag }));
  };
  if (tags) {
    const split = tags.split(',');
    content = split.map((tag, i) => {
      const isHangle = /[가-힣]/.test(tag);
      if (tag.length === 0) return;
      return (
        <Tag
          key={i}
          className={isHangle ? 'hangle' : ''}
          onClick={() => onClickAddFilter(tag)}
        >
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
});

export default ArticleTags;
