export default function getRandomColor() {
  const variants = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'f'];
  const color = [0, 'x'];
  for (let i = 0; i < 6; i++) {
    const key = Math.floor(Math.random() * 15);
    color.push(variants[key]);
  }
  return parseInt(color.join(''), 16);
}
