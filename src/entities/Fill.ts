export type Fill = 0 | 1 | 2 | 3 | 4;

export const FillMap: { [fill: string]: Fill } = Object.freeze({
  '#eee': <Fill>0,
  '#ebedf0': <Fill>0,
  '#c6e48b': <Fill>1,
  '#7bc96f': <Fill>2,
  '#239a3b': <Fill>3,
  '#196127': <Fill>4
});