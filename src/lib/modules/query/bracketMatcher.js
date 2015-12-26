'use strict';

class BracketMatcher {
  match(str) {
    if (!str) return null;

    var openBracketCount = 0;
    var parts = [];
    var currentPartsCount = 0;

    for (var i = 0; i < str.length; i++) {

      var curr = str[i];

      if (curr === '{') {
        openBracketCount++;
      }

      if (openBracketCount > 0) {
        parts[currentPartsCount] = parts[currentPartsCount] ? (parts[currentPartsCount] + curr) : curr;
      }

      if (curr === '}') {
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
