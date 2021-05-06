/* helpers */
export const getBadgeClassName = (status: string) => {
  const suffix: { [status: string]: string } = {
    active: "success",
    inactive: "warning",
    jailed: "danger",
    unbonding: "danger"
  };

  return `badge-${suffix[status]}`;
};
