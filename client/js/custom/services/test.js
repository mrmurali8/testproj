'use strict';
app.factory('TestFactory', function ($resource,API_URL) {
    return $resource(':url', {}, {
        query: { method: 'GET', isArray: true, url:API_URL+'test', params: {}},
        fetch: { method: 'GET', isArray: true, url:API_URL+'test',params: {}},
        create: { method: 'POST', url:API_URL+'test', params: {}},
        show: { method: 'GET', url:API_URL+'test/:testId', params: {testId: '@id'}},
        update: { method: 'PUT', url:API_URL+'test/:testId', params: {testId: '@id'}},
        delete: { method: 'DELETE', url:API_URL+'test/:testId',params: {testId: '@id'}}
    })
});

app.factory('LookupFactory', function ($resource,API_URL) {
    return $resource(':url', {}, {
        query: { method: 'GET', isArray: true, url:API_URL+'lookups', params: {}},
        create: { method: 'POST', url:API_URL+'lookups', params: {}},
        show: { method: 'GET', url:API_URL+'lookups/:id', params: {id: '@id'}},
        update: { method: 'PUT', url:API_URL+'lookups/:id', params: {id: '@id'}},
        delete: { method: 'DELETE', url:API_URL+'lookups/:id',params: {id: '@id'}}
    })
});