
export type Color = {H: number, S: number, L: number};

export function randomColor(): Color {
  return {H: Math.floor(Math.random()*360), S: Math.floor(Math.random()*100), L: 20 + Math.floor(Math.random()*70)};
}

export function colorToString(color: Color) {
  return `hsl(${color.H}, ${color.S}%, ${color.L}%)`
}
