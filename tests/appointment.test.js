import request from 'supertest';
import app from '../src/app.js';
import Appointment from '../src/models/appointmentModel.js';

// Mock data
const appointmentData = new Appointment(1, 1, 1, '2024-04-08', '10:00', 'Consultation', null);

// Login before running tests
let token;

// Use an agent for requests in your tests
let server;
beforeAll((done) => {
    request(app)
        .post('/users/login')
        .send({
            username: 'admin', 
            password: 'A'
        })
        .end((err, response) => {
            token = response.body.token; // save the token!
            // Start server on a random available port
            server = app.listen(0, () => {
                const port = server.address().port;
                global.agent = request.agent(server); // Use this agent for requests in your tests
                done();
            });
        });
});

describe('GET /appointments', () => {
  it('should return all appointments', async () => {
    const res = await request(app)
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
  


afterAll(done => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
});
