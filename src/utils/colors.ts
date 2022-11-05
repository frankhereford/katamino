import {colord, extend} from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);



// https://gist.github.com/cawfree/c08c10f6f2e7b2c8d225d88b031a03ce
export const toCamelCase = (e: string) => {
  return e.replace(/[-_]([a-z])/g, (g: string) => (g[1] || '').toUpperCase())
}

export const toSnakeCase = (e: any) => {
  return e.match(/([A-Z])/g).reduce((str: string, c: string) => str.replace(new RegExp(c), '_' + c.toLowerCase()), e).substring((e.slice(0, 1).match(/([A-Z])/g)) ? 1 : 0)
}

export function mix_colors(color1: string, color2: string) {
  return colord(color1).mix(colord(color2), .5).darken(.05).toHex()
}