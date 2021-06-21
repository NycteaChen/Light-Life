const today = new Date(+new Date() + 8 * 3600 * 1000);
const initStartDate = new Date(+new Date() + 8 * 3600 * 1000);
const endLessDate = new Date(+new Date() + 8 * 3600 * 1000);
const endMostDate = new Date(+new Date() + 8 * 3600 * 1000);
const startMostDate = new Date(+new Date() + 8 * 3600 * 1000);

initStartDate.setDate(initStartDate.getDate() + 1);

function startMostDateHandler(pathname, date) {
  if (pathname.includes("publish")) {
    return date.setDate(startMostDate.getDate() + 21);
  } else {
    return date.setDate(startMostDate.getDate() + 14);
  }
}

function endLessDateHandler(date) {}

endLessDate.setDate(endLessDate.getDate() + 7);
endMostDate.setDate(endMostDate.getDate() + 14);
