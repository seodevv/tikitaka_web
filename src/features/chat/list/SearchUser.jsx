import { memo } from "react";
import { useAddChatMutation, useUpdateChatDateMutation } from "../chatApiSlice";
import { nanoid } from "@reduxjs/toolkit";
import Profile from "../../../components/Profile";

const SearchUser = memo(({ target, id, setSearch, setIsError, setActive }) => {
  const [addChat] = useAddChatMutation();
  const [updateChatDate] = useUpdateChatDateMutation();
  const onDoubleClickAddChat = async (e) => {
    if (e.detail === 2) {
      try {
        setIsError("");
        const response = await addChat({
          id: nanoid(process.env.NANO_ID_LNEGTH || 8),
          creator: id,
          target: target.id,
        }).unwrap();

        if (response.exist) {
          await updateChatDate({ chatId: response.id }).unwrap();
        }
        setActive(response.id);
        setSearch(false);
      } catch (error) {
        console.error(error);
        setIsError("lazy");
        setTimeout(() => {
          setIsError("Sorry, Please try again");
        }, 1000);
      }
    }
  };

  return (
    <div
      className="user flex-row-no flex-align-center disallow-to-drag "
      onClick={onDoubleClickAddChat}
    >
      <Profile
        className="profile"
        type={target.userType}
        profile={target.profile}
      />
      <div draggable="false">
        <p className="nick">{target.nick}</p>
      </div>
    </div>
  );
});

export default SearchUser;
