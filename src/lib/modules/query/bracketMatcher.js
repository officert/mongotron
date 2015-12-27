'use strict';

class BracketMatcher {
  match(str) {
    if (!str) return null;

    let openBracketCount = 0;
    let parts = [];
    let currentPartsCount = 0;

    //keep track if we are within a string, in which case brackets should be ignore
    let openSingleQuoteStringCount = 0;
    let openDoubleQuoteStringCount = 0;

    //TODO: handle single quote inside doubles quotes
    //TODO: handle double quote inside single quotes

    for (let i = 0; i < str.length; i++) {

      let curr = str[i];

      if (curr === '{') {
        openBracketCount++;
      }

      if (curr === '\'') {
        if (openSingleQuoteStringCount === 1) openSingleQuoteStringCount = 0;
        else openSingleQuoteStringCount = 1;
      }

      if (curr === '"') {
        if (openDoubleQuoteStringCount === 1) openDoubleQuoteStringCount = 0;
        else openDoubleQuoteStringCount = 1;
      }

      if (openBracketCount > 0) {
        parts[currentPartsCount] = parts[currentPartsCount] ? (parts[currentPartsCount] + curr) : curr;
      }

      if (curr === '}' && (openSingleQuoteStringCount === 0 && openDoubleQuoteStringCount === 0)) {
        openBracketCount--;

        if (openBracketCount === 0) {
          currentPartsCount++;
        }
      }
    }

    return parts;
  }
}

module.exports = new BracketMatcher();
