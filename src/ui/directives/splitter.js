// angular.module('app').directive('splitter', [
//   '$timeout',
//   function($timeout) {
//     return {
//       restrict: 'A',
//       scope: {
//
//       },
//       link: function(scope, element, attrs) {
//         var splitter = element.split({
//           orientation: attrs.orientation || 'vertical',
//           limit: attrs.limit || 10,
//           position: attrs.position || '50%'
//         });
//
//         $timeout(function() {
//           splitter.refresh();
//         });
//       }
//     };
//   }
// ]);
