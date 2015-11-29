module.exports = [{
  context: 'global',
  commands: {
    'cmd-shift-{': 'tab-manager:previous-tab',
    'cmd-shift-}': 'tab-manager:next-tab',
  }
}, {
  context: 'mongotron-workspace',
  commands: {
    // 'cmd-shift-n': 'connection-manager:new-connection',
  }
}, {
  context: 'mongotron-tab-view',
  commands: {
    'cmd-enter': 'tab-manager:run-query',
    'cmd-shift-h': 'tab-manager:autoformat'
  }
}];
