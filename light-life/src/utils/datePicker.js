export const getToday = () => {
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  return today;
};

export const setDateHandler = (number) => {
  const date = getToday();
  date.setDate(date.getDate() + number);
  return date;
};

export const dateToISOString = (date) => {
  return date.toISOString().substr(0, 10);
};

export const transDateToTime = (date) => {
  const time = new Date(date).getTime();
  return time;
};

export const newEndDateRangeHandler = (
  name,
  target,
  date,
  setEndDate,
  callback
) => {
  const newEndLessDate = new Date();
  const newEndMostDate = new Date();
  if (name === target) {
    newEndLessDate.setDate(parseInt(date.split("-")[2]) + 7);
    newEndMostDate.setDate(parseInt(date.split("-")[2]) + 14);
    if (getToday().getMonth() === newEndLessDate.getMonth()) {
      newEndLessDate.setMonth(parseInt(getToday().getMonth()) + 1);
      newEndMostDate.setMonth(parseInt(getToday().getMonth()) + 1);
    }
  }
  setEndDate({
    min: callback(newEndLessDate),
    max: callback(newEndMostDate),
  });

  return callback(newEndLessDate);
};
