import './polyfills.ts';

import 'zone.js/dist/zone';

if ('production' === ENV) {
  // Production
}
else {

  // Development
  Error.stackTraceLimit = Infinity;

  /* tslint:disable no-require-imports */
  /* tslint:disable no-var-requires */
  require('zone.js/dist/long-stack-trace-zone');
}

import 'reflect-metadata';
