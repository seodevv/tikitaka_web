import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useGetChatMessageByIdMutation,
  useGetChatMessageQuery,
} from "../chatApiSlice";
import { getFormatDate } from "../../../app/common";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";
import ScrollBottom from "./ScrollBottom";
import Date from "./Date";
import EnlargeImage from "./EnlargeImage";
import ProfileDetail from "./ProfileDetail";
import { useSelector } from "react-redux";
import { selectTypingById } from "../chatReducer";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const messageObject = (data) => {
  return {
    id: data.id,
    type: data.type,
    message: data.message,
  };
};

const ChatDetailStream = memo(({ chatId, creator, target }) => {
  const {
    data: messages,
    isSuccess,
    isFetching,
  } = useGetChatMessageQuery({
    chatId,
    limit: process.env.DEFAULT_CHAT_COUNT || 30,
  });

  let firstMessageId;
  let messagesContent = [];
  let imagesContent;
  if (isSuccess && !isFetching) {
    let prevMessage;
    imagesContent = [];
    messages.forEach((v, i) => {
      const other = creator !== v.userId;
      const isSame = prevMessage
        ? prevMessage.userId === v.userId &&
          prevMessage.date.substring(0, 17) === v.date.substring(0, 17)
        : false;
      const newDate = prevMessage
        ? prevMessage.date.substring(0, 10) !== v.date.substring(0, 10)
        : true;
      const isFirstIndex = i === 0;
      const isLastIndex = i === messages.length - 1;
      if (!target && other) target = v.userId;

      const length = messagesContent.length;
      if (isSame) {
        messagesContent[length - 1].messages.push(messageObject(v));
      } else {
        messagesContent.push({
          id: v.id,
          userInfo: {
            id: v.userId,
            type: v.userType,
            email: v.email,
            nick: v.nick,
            profile: v.profile,
            birth: v.birth.substring(0, 10),
            regist: v.regist.substring(0, 10),
          },
          messages: [messageObject(v)],
          date: v.date,
          other,
          newDate,
          new: isLastIndex,
        });
      }

      if (isFirstIndex) {
        firstMessageId = v.id;
      }
      if (isLastIndex) {
        messagesContent[messagesContent.length - 1].last = true;
      }

      if (v.type === "image") {
        imagesContent.push(v.message);
      }

      prevMessage = v;
    });
  }

  const [observer] = useState(
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    })
  );

  const scrollRef = useRef(null);
  const onScrollTo = (type) => {
    if (scrollRef.current) {
      const scrollHeight = scrollRef.current.scrollHeight;
      switch (type) {
        case "bottom":
          scrollRef.current.scrollTop = scrollHeight;
          break;
        case "target":
          scrollRef.current.scrollTop = scrollHeight - prevScrollTop.current;
          break;
        case "bottom-smooth":
          scrollRef.current.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
          });
          break;
      }
    }
  };

  const [lastDate, setLastDate] = useState("");
  useEffect(() => {
    if (messages && messages.length !== 0 && !prevScrollTop.current) {
      setLastDate(getFormatDate(messages[messages.length - 1].date));
    }
    if (scrollRef.current && !prevScrollTop.current) {
      onScrollTo("bottom");
    }
  }, [messages]);

  const [scrollBottom, setScrollBottom] = useState(false);
  const prevScrollTop = useRef(null);
  const prevStop = useRef(false);
  const [getMoreChatMessage, { isLoading }] = useGetChatMessageByIdMutation();
  const onScrollMessageBox = useCallback(async () => {
    const targets = document.querySelectorAll(".show");
    const lastElement = targets[targets.length - 1];
    if (lastElement) {
      setLastDate(lastElement.dataset.date);
    }
    const onBottom =
      parseInt(
        (scrollRef.current.scrollTop + scrollRef.current.clientHeight) / 100
      ) === parseInt(scrollRef.current.scrollHeight / 100);
    if (!onBottom) {
      setScrollBottom(true);
    } else {
      setScrollBottom(false);
    }

    if (
      scrollRef.current.scrollTop === 0 &&
      firstMessageId &&
      !prevStop.current &&
      !isLoading
    ) {
      try {
        prevScrollTop.current = scrollRef.current.scrollHeight;
        const result = await getMoreChatMessage({
          id: firstMessageId,
          chatId,
          limit: process.env.DEFAULT_CHAT_COUNT || 30,
        }).unwrap();
        onScrollTo("target");
        prevStop.current = result.length === 0 ? true : false;
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    return () => {
      prevScrollTop.current = null;
      prevStop.current = false;
      setProfileDetail("");
    };
  }, [chatId]);

  const [enlarge, setEnlarge] = useState();
  const [profileDetail, setProfileDetail] = useState();

  const typing = useSelector((state) => selectTypingById(state, chatId));

  useEffect(() => {
    if (
      typing &&
      scrollRef.current &&
      parseInt(
        (scrollRef.current.scrollTop + scrollRef.current.clientHeight) / 100
      ) === parseInt(scrollRef.current.scrollHeight / 100)
    ) {
      onScrollTo("bottom");
    }
  }, [typing]);

  return (
    <div className={`chat-stream-box p-relative`}>
      {enlarge && (
        <EnlargeImage
          chatId={chatId}
          imagesContent={imagesContent}
          enlarge={enlarge}
          setEnlarge={setEnlarge}
        />
      )}
      {profileDetail && (
        <ProfileDetail
          profileDetail={profileDetail}
          setProfileDetail={setProfileDetail}
        />
      )}
      {lastDate && (
        <Date
          lastDate={lastDate}
          setLastDate={setLastDate}
          scrollRef={scrollRef}
        />
      )}
      {useMemo(
        () => (
          <div
            className={`scroll`}
            ref={scrollRef}
            onScroll={onScrollMessageBox}
          >
            {messagesContent.map((v) => (
              <MessageBox
                key={v.id}
                chatId={chatId}
                userInfo={v.userInfo}
                data={v}
                observer={observer}
                setEnlarge={setEnlarge}
                scrollRef={scrollRef}
                prevScrollTop={prevScrollTop}
                setProfileDetail={setProfileDetail}
              />
            ))}
            {typing && (
              <div className="chat-stream chat-stream-typing other">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  size="2xl"
                  color="#727272"
                  beatFade
                />
              </div>
            )}
          </div>
        ),
        [messages, typing]
      )}
      <InputBox
        chatId={chatId}
        creator={creator}
        target={target}
        onScrollTo={onScrollTo}
        typing={typing}
      />
      {scrollBottom && (
        <ScrollBottom
          scrollRef={scrollRef}
          onScrollTo={onScrollTo}
          setScrollBottom={setScrollBottom}
        />
      )}
    </div>
  );
});

export default ChatDetailStream;
