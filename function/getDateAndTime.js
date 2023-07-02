const moment = require("moment-timezone");

// 서버 시간대 설정
const serverTimezone = "Asia/Seoul"; // 서버의 시간대에 맞게 설정해야 함

const getDateAndTime = async () => {
  const now = moment().tz(serverTimezone); // 서버 시간대를 기준으로 현재 시간을 가져옴

  // 날짜와 시간 추출
  const date = now.format("YYYY-MM-DD");
  const time = now.format("HH:mm:ss");

  const dateTime = {
    time: time,
    date: date,
  };
  return dateTime;
};

module.exports = { getDateAndTime };
