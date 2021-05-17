export const setCookie = (key: string, value: string) =>
  (document.cookie = `${key}=${value}; path=/`);

export const getCookie = (key: string) => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const value = cookie.split("=");
    if (value[0] === key) return value[1];
  }
};
