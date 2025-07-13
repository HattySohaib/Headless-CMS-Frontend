export const capitalizeFirstLetter = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const truncate = (str, n) => {
  if (!str) return "";
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};
