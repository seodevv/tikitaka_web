import { useGetOpenGraphQuery } from '../chatApiSlice';
import Spinner from '../../../components/Spinner';

const OpenGraph = ({ href_url }) => {
  const url = /^https?/.test(href_url)
    ? href_url.replace(/^https?:/, '')
    : /^\/\//.test(href_url)
    ? href_url
    : `//${href_url}`;

  const { data, isSuccess, isLoading, isError } = useGetOpenGraphQuery({ url });

  if (isError || (isSuccess && !data.success)) {
    return <></>;
  }

  if (isLoading) {
    return (
      <div className="message-box">
        <span className="opengraph loading message d-inlineblock break-all text-start">
          <Spinner className="spinner" color="#000" />
        </span>
      </div>
    );
  }

  const imageUrl = data.opengraph.image
    ? data.opengraph.image.search(/^http/) !== -1 ||
      data.opengraph.image.search(/^data/) !== -1 ||
      data.opengraph.image.search(/^\/\//) !== -1
      ? data.opengraph.image
      : data.opengraph.url.search(/^http/) !== -1
      ? `${data.opengraph.url}/${data.opengraph.image}`
      : data.opengraph.url.search(/^www/) !== -1
      ? `//${data.opengraph.url}/${data.opengraph.image}`
      : `//www.${data.opengraph.url}/${data.opengraph.image}`
    : `${process.env.SERVER_URL}/img/common/web.png`;

  const onClickOpenGraph = () => {
    window.open(data.opengraph.url, '_blank', 'noopener, noreferrer');
  };

  return (
    <>
      <div className="message-box">
        <span
          className="opengraph message d-inlineblock break-all text-start"
          onClick={onClickOpenGraph}
        >
          <img
            className="preview"
            src={imageUrl}
            alt="image"
            draggable="false"
          />
          {data.opengraph.title && (
            <h5 className="title">
              {data.opengraph.title.length > 25
                ? data.opengraph.title.substring(0, 50) + '...'
                : data.opengraph.title}
            </h5>
          )}
          {data.opengraph.description && (
            <p className="desc">{data.opengraph.description}</p>
          )}
        </span>
      </div>
    </>
  );
};

export default OpenGraph;
