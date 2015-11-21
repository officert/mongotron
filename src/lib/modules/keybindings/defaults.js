module.exports = [{
  context: 'mongotron-workspace',
  commands: {
    'cmd-shift-n': 'connection-manager:new-connection',
  }
}, {
  context: 'mongotron-tab-view',
  commands: {
    'cmd-enter': 'tab-manager:run-query',
    'cmd-shift-{': 'tab-manager:previous-tab',
    'cmd-shift-}': 'tab-manager:next-tab',
  }
}];
