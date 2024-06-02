export const getDateDifference = (dateOne: Date, dateTwo: Date) => {
  const differenceInMilliseconds = dateOne.getTime() - dateTwo.getTime();
  const daysLeft = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24));

  return daysLeft;
};
