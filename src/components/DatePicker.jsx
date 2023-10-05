import { useRef } from "react";

const DatePicker = ({ date, setDate, arr }) => {
  const buttonRef = useRef(null);
  const ref = useRef(null);
  const onClickActiveOption = () => {
    const other = document.querySelectorAll(".calendar-slide");
    other.forEach((el) => {
      if (el === ref.current) return;
      el.classList.remove("calendar-slide");
    });
    if (ref.current) {
      ref.current.classList.toggle("calendar-slide");
    }
  };
  const onClickSelectYear = (e, v) => {
    setDate(v);
    e.target.scrollIntoView();
    ref.current.classList.remove("calendar-slide");
  };

  return (
    <div className={`calendar p-relative d-inlineblock`}>
      <button
        className="calendar-select"
        ref={buttonRef}
        onClick={() => onClickActiveOption("year")}
      >
        {date}
      </button>
      <ul className={`calendar-options`} ref={ref}>
        {arr.map((v) => (
          <li
            className={`${v === date ? "select" : ""}`}
            key={v}
            onClick={(e) => onClickSelectYear(e, v)}
          >
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatePicker;
