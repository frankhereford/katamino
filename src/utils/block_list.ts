
export function get_block_index(blocks: [object], item: string) {
  const element = blocks.find((element) => element.id === item);
  return blocks.indexOf(element);
}

export function find_previous(blocks: [object], item: string) {
  if (!item) { return blocks[0].id; }
  const index = get_block_index(blocks, item);
  if (index === 0) {
    return blocks[blocks.length - 1].id;
  }
  return blocks[index - 1].id;
}

export function find_next(blocks: [object], item: string) {
  const index = get_block_index(blocks, item);
  if (!item) { return blocks[0].id; }
  if (index === blocks.length - 1) {
    return blocks[0].id;
  }
  return blocks[index + 1].id;
}
