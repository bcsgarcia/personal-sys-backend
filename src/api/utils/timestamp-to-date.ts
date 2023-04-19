export function convertTimestampToDate(mySQLDate) {
  const dateParts = mySQLDate.split(/[- :]/);
  return new Date(
    Date.UTC(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2],
      dateParts[3],
      dateParts[4],
      dateParts[5],
    ),
  );
}
