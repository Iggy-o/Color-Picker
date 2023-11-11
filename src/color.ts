
export type Color = {H: number, S: number, L: number};

export function randomColor(): Color {
  return {H: Math.floor(Math.random()*360), S: Math.floor(Math.random()*100), L: 20 + Math.floor(Math.random()*70)};
}

export function colorToString(color: Color) {
  return `hsl(${color.H}, ${color.S}%, ${color.L}%)`
}

type RGB = {R: number, G: number, B: number};
export function rgbStringToNum(color: string): RGB {
    let text = color.split("(")[1].split(")")[0];
    let rgb: number[] = [];
    text.split(",").forEach(element => {
      rgb.push( parseInt(element));
    });
    return {R: rgb[0], G: rgb[1], B: rgb[2]};
}
export function rgbToHex(rgb: RGB): string {
    let hexadecimal = (rgb.R << 16) + (rgb.G << 8) + (rgb.B);
    let hex = `${hexadecimal.toString(16).toUpperCase()}`.padStart(6, "0");
    let string = `#${hex}`;
    return string;
}
