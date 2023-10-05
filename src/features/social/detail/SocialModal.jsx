import { useDispatch, useSelector } from 'react-redux';
import { useDeleteSocialMutation } from '../socialApiSlice';
import { closeArticle, closeModal, setModal } from '../socialReducer';
import Spinner from '../../../components/Spinner';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCreatorId } from '../../login/loginReducer';
import {
  useGetFeedsIsFollowQuery,
  usePostFeedsToggleFollowMutation,
} from '../../feed/feedApiSlice';

const SocialModal = ({ socialId, type, userId }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const creatorId = useSelector(selectCreatorId);
  const [owner, setOwner] = useState(false);

  const { data: isFollow = { result: false } } = useGetFeedsIsFollowQuery({
    userId: creatorId,
    target: userId,
  });

  const [deleteSocial, { isLoading }] = useDeleteSocialMutation();
  const onClickDeleteSocial = async () => {
    try {
      await deleteSocial({ socialId });
      dispatch(closeArticle());
      dispatch(closeModal());
    } catch (error) {
      console.error(error);
    }
  };

  const [toggleFollow] = usePostFeedsToggleFollowMutation();
  const onClickToggleFollow = async () => {
    try {
      await toggleFollow({
        userId: creatorId,
        target: userId,
      });
      dispatch(closeModal());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        dispatch(closeModal());
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  useLayoutEffect(() => {
    if (creatorId === userId) {
      setOwner(true);
    }
  }, [creatorId, userId]);

  return (
    <>
      <div className="modal-container ani-fade-in">
        <div className="modal">
          {owner && type === 'detail' && (
            <button
              className="button btn-effect transit-none ft-green"
              onClick={() => {
                dispatch(setModal(true));
              }}
            >
              수정
            </button>
          )}
          {owner && (
            <button
              className="button btn-effect transit-none ft-red"
              onClick={onClickDeleteSocial}
            >
              삭제
            </button>
          )}
          {!owner && (
            <button
              className="button btn-effect transit-none"
              onClick={onClickToggleFollow}
              style={{ color: isFollow.result ? '#f00' : '#fff' }}
            >
              {isFollow.result ? '팔로우 끊기' : '팔로우'}
            </button>
          )}
          {type !== 'detail' && (
            <button
              className="button btn-effect transit-none"
              onClick={() => {
                dispatch(closeModal());
                navigator(`/feed/${userId}`);
              }}
            >
              피드 방문
            </button>
          )}
          <button
            className="button btn-effect transit-none"
            onClick={() => dispatch(closeModal())}
          >
            취소
          </button>
          {isLoading && <Spinner className="loading" />}
        </div>
      </div>
    </>
  );
};

export default SocialModal;
