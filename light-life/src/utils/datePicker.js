const initStartDate = new Date(+new Date() + 8 * 3600 * 1000);
const endLessDate = new Date(+new Date() + 8 * 3600 * 1000);
const endMostDate = new Date(+new Date() + 8 * 3600 * 1000);
const startMostDate = new Date(+new Date() + 8 * 3600 * 1000);

initStartDate.setDate(initStartDate.getDate() + 1);
endLessDate.setDate(endLessDate.getDate() + 7);
endMostDate.setDate(endMostDate.getDate() + 14);

// const startMostDateHandler = (date, number) => {
//   return date.setDate(startMostDate.getDate() + number);
// };

export const getToday = () => {
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  return today;
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
