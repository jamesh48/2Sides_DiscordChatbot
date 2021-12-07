export const genRandToken = () => {
  const rand = () => Math.random().toString(36).substr(2);

  const token = "xid_" + rand() + rand();
  return token;
};
