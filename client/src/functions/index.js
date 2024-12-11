export const formattedDate = (dateStr) => {
  const date = new Date(dateStr);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", dateOptions).format(date);
};
