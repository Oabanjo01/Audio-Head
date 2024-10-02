export function toSentenceCase(sentence: string) {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return sentence;
  }

  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}