module.exports = [{
  context: 'mongotron-workspace',
  commands: [{
    'cmd-shift-n': 'connection-manager:new-connection',
  }]
}, {
  context: 'mongotron-tab-view',
  commands: [{
    'cmd-w': 'tab-manager:close-active-tab',
    'cmd-shift-{': 'tab-manager:previous-tab',
    'cmd-shift-}': 'tab-manager:next-tab',
  }]
}, {
  context: 'mongotron-query-editor',
  commands: [{
    'cmd-enter': 'query-editor:run-query'
  }]
}];
