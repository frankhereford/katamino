
export function isBlockOwner(block: any, userId: string) {
  return block.penta.userId === userId;
}

export function isPentaOwner(penta: any, userId: string) {
  return penta.userId === userId;
}
