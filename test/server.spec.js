
'use strict';

const test = require('ava');
const req = require('supertest');
const pug = require('pug');

const app = require('../server');

test('GET `/` should return with 200 and serve HTML', async t => {
  const res = await req(app).get('/');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /html/);
});

test('GET `/` HTML should render with brochures', async t => {
  const res = await req(app).get('/');

  const { findMostRecentUrls } = require('../services/mongo-service');
  const brochures = await findMostRecentUrls();

  const templateHTML = pug.renderFile('./views/index.pug', { brochures });
  t.is(res.text, templateHTML);
});
