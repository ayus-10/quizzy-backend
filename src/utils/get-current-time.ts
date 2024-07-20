export const getCurrentTime = () => {
  const utcDateString = new Date().toISOString();
  const timeStamp = new Date(utcDateString).getTime();
  return timeStamp;
};
