import { parseISO } from 'date-fns';

export const getKoreaDate = (date) => {
  const offset = new Date().getTimezoneOffset() * 60000;
  if (date) {
    return new Date(date - offset);
  }
  return new Date(Date.now() - offset);
};

export const getFormatDate = (dateISO, separator = '-') => {
  return dateISO.substring(0, 10).replaceAll('-', separator);
};

export const convertTime = (dateISO) => {
  const hour = Number(dateISO.substring(11, 13));
  const minute = Number(dateISO.substring(14, 16));
  const amPm = hour >= 12 ? 'PM' : 'AM';
  const convertTime =
    hour > 12
      ? `${hour - 12}:${minute >= 10 ? minute : '0' + minute} ${amPm}`
      : `${hour}:${minute > 10 ? minute : '0' + minute} ${amPm}`;
  return convertTime;
};

export const convertDate = (dateISO) => {
  const offset = getKoreaDate().getTime() - parseISO(dateISO).getTime();
  const todayOffset =
    getKoreaDate().getTime() -
    new Date(getKoreaDate().toISOString().substring(0, 10)).getTime();

  const oneDay = 24 * 60 * 60 * 1000;
  if (offset <= todayOffset) {
    return convertTime(dateISO);
  } else if (offset <= todayOffset + oneDay) {
    return 'yesterday';
  } else {
    return dateISO.substring(0, 10);
  }
};

export const getRangeDate = (dateISO) => {
  const today = getKoreaDate().toISOString().substring(0, 10);
  const yesterday = new Date(
    new Date(today).setDate(new Date(today).getDate() - 1)
  )
    .toISOString()
    .substring(0, 10);
  const week = new Date(
    new Date(today).setDate(
      new Date(today).getDate() - 7 - new Date(today).getDay()
    )
  )
    .toISOString()
    .substring(0, 10);
  const month = new Date(
    new Date(today).setMonth(new Date(today).getMonth() - 1)
  )
    .toISOString()
    .substring(0, 10);
  const target = dateISO.substring(0, 10);

  if (target >= today) {
    return 'today';
  } else if (target >= yesterday) {
    return 'yesterday';
  } else if (target >= week) {
    return 'week';
  } else if (target >= month) {
    return 'month';
  } else {
    return 'long ago';
  }
};
