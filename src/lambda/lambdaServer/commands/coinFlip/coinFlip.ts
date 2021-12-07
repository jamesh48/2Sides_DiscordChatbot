export const coinFlip = () => {
  const x = Math.floor(Math.random() * 2) === 0;
  return (x && "heads") || "tails";
};
