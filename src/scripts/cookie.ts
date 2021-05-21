export const setCookie = (key: string, value: string, day: number) => {
  const date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = `${key}=${value}; path=/; expires=${date.toUTCString()};`;
};

export const getCookie = (key: string) => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const value = cookie.split("=");
    if (value[0] === key) return value[1];
  }
};
