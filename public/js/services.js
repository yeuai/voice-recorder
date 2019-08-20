'use strict';

var app = angular.module('voiceRecorder');
app.factory('svText', function ($resource) {
  const prefix = '/api';

  return $resource(prefix, {
    id: '@id'
  }, {
    all: {
      method: 'GET',
      url: prefix + '/text',
    },
    info: {
      method: 'GET',
      url: prefix + '/text/:id',
      params: {
        id: '@id',
      },
    },
    create: {
      method: 'POST',
      url: prefix + '/text',
    },
  })
});
