import request from 'supertest';
import app from '../src/app.js';
import Doctor from '../src/models/doctorModel.js';

// Mock data
const doctorData = new Doctor(1, 'Doe', 'John', 'Cardiology', '1234567890', null, 1);

// Login before running tests
let token;



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



describe('GET /doctors', () => {
  it('should return all doctors', async () => {
    const res = await request(app)
      .get('/doctors')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
  
describe('GET /doctors/:id', () => {
  it('should return a doctor by id', async () => {
    const res = await request(app)
      .get(`/doctors/${doctorData.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');
    expect(res.body).toHaveProperty('id', doctorData.id);
  });
});

describe('PUT /doctors/:id', () => {
    it('should update a doctor', async () => {
        const res = await request(app)
        .put(`/doctors/${doctorData.id}`)
        .send({ name: 'Jane' })
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
    }
);


afterAll(done => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
