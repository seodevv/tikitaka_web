import { useEffect, useState } from "react";
import DatePicker from "./DatePicker";

const Calendar = ({ birth, setBirth }) => {
  const [year, setYear] = useState(birth.substring(0, 4));
  const [month, setMonth] = useState(birth.substring(5, 7));
  const [day, setDay] = useState(birth.substring(8, 10));

  const years = Array(50)
    .fill()
    .map((_, i) => `${2023 - i}`);
  const months = Array(12)
    .fill()
    .map((_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));
  const days = Array(
    new Date(birth.substring(0, 4), birth.substring(5, 7), 0).getDate()
  )
    .fill()
    .map((_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));

  useEffect(() => {
    if (birth !== `${year}-${month}-${day}`) {
      setBirth(`${year}-${month}-${day}`);
    }
  }, [year, month, day]);

  useEffect(() => {
    setYear(birth.substring(0, 4));
    setMonth(birth.substring(5, 7));
    setDay(birth.substring(8, 10));
  }, [birth]);

  return (
    <>
      <DatePicker date={year} setDate={setYear} arr={years} />
      <DatePicker date={month} setDate={setMonth} arr={months} />
      <DatePicker date={day} setDate={setDay} arr={days} />
    </>
  );
};

export default Calendar;
