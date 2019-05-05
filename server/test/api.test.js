const request = require('supertest');
const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏' 
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('responds with inserted message', (done) => {
    const reqObj = {
      name: 'Karl',
      message: 'Tere olen Karl',
      latitude: -90,
      longitude: 180
    };

    const resObj = {
      ...reqObj,
      _id: '5cc6ed890211f2bfb3ae204b',
      date: '2019-04-29T12:26:49.458Z'
    };

    request(app)
      .post('/api/v1/messages')
      .send(reqObj)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '5cc6ed890211f2bfb3ae204b';
        res.body.date = '2019-04-29T12:26:49.458Z';
      })
      .expect(200, resObj, done);
  });
});
