import {colord, extend} from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

export const colors = {
  white: "#ffffff",
  grey: "#808080",
  red: "#b40d0d",
  green: "#95ff85",
  darkGrey: "#353535",
  purple: "#66009d",
  brown: "#583200",
  darkBlue: "#0222b1",
  darkGreen: "#004d00",
  yellow: "#f9d237",
  teal: "#00b3b3",
  blue: "#39c9f1",
  orange: "#ff6600",
  pink: "#ff47c8"
}

// https://gist.github.com/cawfree/c08c10f6f2e7b2c8d225d88b031a03ce
export const toCamelCase = (e) => {
  return e.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase())
}

export const toSnakeCase = (e) => {
  return e.match(/([A-Z])/g).reduce((str, c) => str.replace(new RegExp(c), '_' + c.toLowerCase()), e).substring((e.slice(0, 1).match(/([A-Z])/g)) ? 1 : 0)
}

export function mix_colors(color1, color2) {
  return colord(color1).mix(colord(color2), .5).darken(.05).toHex()
}
