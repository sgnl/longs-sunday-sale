
'use strict';

const test = require('ava');

const { findMostRecentUrls } = require('../../services/mongo-service');

test('findMostRecentUrls works', async t => {
  const result = await findMostRecentUrls();

  t.true(Array.isArray(result));
  t.truthy(result[0].date_added);
});
