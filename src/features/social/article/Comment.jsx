import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from "../../../components/Profile";
import Ago from "../../../components/Ago";
import {
  faArrowLeft,
  faCircleCheck,
  faCircleXmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useDeleteCommentMutation } from "../socialApiSlice";
import { useSelector } from "react-redux";
import { selectCreatorId } from "../../login/loginReducer";

const Comment = ({ wrtierId, comment }) => {
  const creator = useSelector(selectCreatorId);

  const isAuthor = wrtierId === comment.userId;
  const isOwner = creator === comment.userId;
  const isHangleNick = /[가-힣]/.test(comment.nick) ? "hangle" : "";
  const isHangleReply = /[가-힣]/.test(comment.reply) ? "hangle" : "";
  const isLong = comment.reply.length > 30;

  let reply;
  const [more, setMore] = useState(false);
  if (isLong && !more) {
    reply = comment.reply.substring(0, 30) + "...";
  } else {
    reply = comment.reply;
  }
  const onClickMore = () => setMore(!more);

  const [confirm, setConfirm] = useState("");
  const [sure, setSure] = useState("");
  const onClickOpenConfirm = () => setConfirm(true);
  const onClickCloseConfirm = () => setConfirm(false);
  const onClickOpenSure = () => setSure(true);
  const onClickCloseSure = () => {
    setSure(false);
    setConfirm(false);
  };

  const [deleteComment] = useDeleteCommentMutation();
  const onClickDeleteComment = async () => {
    try {
      await deleteComment({ id: comment.id, socialId: comment.socialId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="comment-box">
        <Profile
          className="profile"
          type={comment.type}
          profile={comment.profile}
        />
        <div className="comment">
          {isAuthor && (
            <FontAwesomeIcon className="writer" icon={faCircleCheck} />
          )}
          <a className={isHangleNick}>{comment.nick}</a>
          <span className={isHangleReply}>{reply}</span>
          {isLong && (
            <span className="more btn-effect" onClick={onClickMore}>
              &nbsp;{more ? "가리기" : "더보기"}
            </span>
          )}
          <div className="comment-info">
            <Ago className="ago" date={comment.created} />
            {isOwner && (
              <button
                className="button btn-effect"
                onClick={onClickOpenConfirm}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
            )}
          </div>
        </div>
        {confirm && (
          <div className="comment-confirm ani-fade-in">
            {!sure ? (
              <>
                <button className="button btn-effect" onClick={onClickOpenSure}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button
                  className="button btn-effect"
                  onClick={onClickCloseConfirm}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </>
            ) : (
              <div className="sure ani-fade-in">
                <span className="message">정말 삭제하시겠습니까?</span>
                <br />
                <button
                  className="button btn-effect"
                  onClick={onClickDeleteComment}
                >
                  <FontAwesomeIcon icon={faCircleCheck} color="#278839" />
                </button>
                <button
                  className="button btn-effect"
                  onClick={onClickCloseSure}
                >
                  <FontAwesomeIcon icon={faCircleXmark} color="#cccccc" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Comment;
