
'use strict';

const test = require('ava');
const req = require('supertest');
// const pug = require('pug');

const app = require('../server');

test('GET `/` ', async t => {
  let res = await req(app).get('/');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /html/);
  t.truthy(res.body);
  // const templateHTML = pug.renderFile('./views/enroll.pug');
  // t.is(res.text, templateHTML);
});
