import request from 'supertest';
import app from '../src/app.js';
import Patient from '../src/models/patientModel.js';

// Mock data for patient
const patientData = new Patient(1, 'Smith', 'Jane', '2000-01-01', 'female', '123 Main St', '20307075056013', [], null, 1);

let token;
let server;

beforeAll(done => {
    request(app)
        .post('/users/login') // Adjust the endpoint if necessary
        .send({
            username: 'admin', 
            password: 'A'
        })
        .end((err, response) => {
            if (err) {
                return done(err);
            }
            token = response.body.token; // save the token!
            // Start server on a random available port
            server = app.listen(0, () => {
                global.agent = request.agent(server); // Use this agent for requests in your tests
                done();
            });
        });
});

// Example test for getting all patients
describe('GET /patients', () => {
    it('should return all patients', async () => {
        const res = await global.agent
            .get('/patients')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(0); // Adjust according to your expected results
    });
});


afterAll(done => {
    if (server) {
        server.close(done);
    } else {
        done();
    }
});
