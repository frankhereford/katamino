// show the difficulty bracket as a reptile
/* eslint-disable no-multi-spaces, @typescript-eslint/brace-style, space-in-parens */
export function showSlamEmoji (slam: string) {
  if      (slam === 'Small Slam')        { return '🦎' }
  else if (slam === 'The Slam')          { return '🐊' }
  else if (slam === 'The Ultimate Slam') { return '🐉' }
  else if (slam === 'The Full Board')    { return '🦕' }
  return slam
}
/* eslint-enable no-multi-spaces, @typescript-eslint/brace-style, space-in-parens */
