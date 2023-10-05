import { useCallback, useEffect, useRef, useState } from "react";
import { getFormatDate } from "../../../app/common";

const Date = ({ lastDate, setLastDate, scrollRef }) => {
  const dateRef = useRef(null);

  const onChangeDateInput = useCallback((e) => {
    const target = document.querySelectorAll(`._${e.target.value}`);
    if (target.length !== 0 && scrollRef.current) {
      target[target.length - 1].scrollIntoView();
      setLastDate(e.target.value);
    }
  });

  useEffect(() => {
    if (dateRef.current) {
      dateRef.current.parentNode.classList.remove("date-animation");
      dateRef.current.parentNode.offsetWidth;
      dateRef.current.parentNode.classList.add("date-animation");
    }
  }, [lastDate]);

  return (
    <div className="date">
      <label ref={dateRef} htmlFor="date">
        {getFormatDate(lastDate, "/")}
      </label>
      <input
        id="date"
        type="date"
        value={lastDate}
        onChange={onChangeDateInput}
      />
    </div>
  );
};

export default Date;
