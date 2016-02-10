'use strict';

(function() {
  const esprima = require('esprima');
  const escodegen = require('escodegen');

  const logger = require('lib/modules/logger');

  CodeMirror.defineExtension('autoFormatRange', function(from, to) {
    try {
      let code = this.getRange(from, to);
      let options = {
        comment: true,
        format: {
          indent: {
            style: '  '
          }
        }
      };

      let syntax = esprima.parse(code, {
        raw: true,
        tokens: true,
        range: true,
        comment: true
      });

      syntax = escodegen.attachComments(syntax, syntax.comments, syntax.tokens);

      code = escodegen.generate(syntax, options);

      this.operation(() => {
        this.replaceRange(code, from, to);
      });
    } catch (err) {
      logger.error(err);
    }
  });

  // CodeMirror.defineExtension('commentRange', function(isComment, from, to) {
  //   let curMode = CodeMirror.innerMode(this.getMode(), this.getTokenAt(from).state).mode;
  //
  //   this.operation(() => {
  //     if (isComment) { // Comment range
  //       this.replaceRange(curMode.commentEnd, to);
  //       this.replaceRange(curMode.commentStart, from);
  //       if (from.line === to.line && from.ch === to.ch) // An empty comment inserted - put cursor inside
  //         this.setCursor(from.line, from.ch + curMode.commentStart.length);
  //     } else { // Uncomment range
  //       let selText = this.getRange(from, to);
  //       let startIndex = selText.indexOf(curMode.commentStart);
  //       let endIndex = selText.lastIndexOf(curMode.commentEnd);
  //       if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
  //         // Take string till comment start
  //         selText = selText.substr(0, startIndex)
  //           // From comment start till comment end
  //           + selText.substring(startIndex + curMode.commentStart.length, endIndex) // jshint ignore:line
  //           // From comment end till string end
  //           + selText.substr(endIndex + curMode.commentEnd.length); // jshint ignore:line
  //       }
  //       this.replaceRange(selText, from, to);
  //     }
  //   });
  // });
})();
