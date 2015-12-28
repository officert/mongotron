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

      //ignore the opening bracket if we're in a single or double quote string
      if (curr === '{' && (openSingleQuoteStringCount === 0 && openDoubleQuoteStringCount === 0)) {
        openBracketCount++;
      }

      //ignore the single quote if we're inside a double quote string
      if (curr === "'" && openDoubleQuoteStringCount === 0) {
        if (openSingleQuoteStringCount === 1) openSingleQuoteStringCount = 0;
        else openSingleQuoteStringCount = 1;
      }

      //ignore the double quote if we're inside a single quote string
      if (curr === '"' && openSingleQuoteStringCount === 0) {
        if (openDoubleQuoteStringCount === 1) openDoubleQuoteStringCount = 0;
        else openDoubleQuoteStringCount = 1;
      }

      if (openBracketCount > 0) {
        parts[currentPartsCount] = parts[currentPartsCount] ? (parts[currentPartsCount] + curr) : curr;
      }

      //ignore the closing bracket if we're in a single or double quote string
      if (curr === '}' && (openSingleQuoteStringCount === 0 && openDoubleQuoteStringCount === 0)) {
        openBracketCount--;

        if (openBracketCount === 0) {
          currentPartsCount++;
        }
      }

      // console.log('parts', parts);
      // console.log('openBracketCount', openBracketCount);
      // console.log('openSingleQuoteStringCount', openSingleQuoteStringCount);
      // console.log('openDoubleQuoteStringCount', openDoubleQuoteStringCount);
    }

    // console.log('openBracketCount', openBracketCount);

    return parts;
  }
}

module.exports = new BracketMatcher();
