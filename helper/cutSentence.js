export function cutSentence(sentence, maxWords) {
  if (sentence) {
    const words = sentence.split(' ');

    if (words.length <= maxWords) {
      return sentence;
    }

    let newSentence = '';
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      newSentence += word + ' ';
      wordCount++;

      if (word.includes('.') && wordCount >= maxWords) {
        break;
      } else if (wordCount >= maxWords) {
        newSentence += '...';
        break;
      }
    }
    return newSentence.trim();
  } else {
    return;
  }
}
