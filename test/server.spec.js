
'use strict';

const test = require('ava');
const req = require('supertest');
const pug = require('pug');

const app = require('../server');

test('GET `/` ', async t => {
  let res = await req(app).get('/');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /html/);

  const { findMostRecentUrls } = require('../services/mongo-service');
  const brochures = await findMostRecentUrls();

  const templateHTML = pug.renderFile('./views/index.pug', { brochures });
  t.is(res.text, templateHTML);
});
