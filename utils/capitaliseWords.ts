export const capitaliseWord = (word: string) => {
  if (word) {
    return `${word[0].toUpperCase()}${word.substring(1, word.length)}`;
  }
  return word
}
