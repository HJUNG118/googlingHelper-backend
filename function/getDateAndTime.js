const getDateAndTime = async () => {
  const now = new Date(); // 현재 시간을 가져옴
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}`;
  const dateTime = {
    time: time,
    date: date,
  };
  return dateTime;
};

module.exports = { getDateAndTime };