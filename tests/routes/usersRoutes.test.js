// const request = require("supertest");
// const { serverEcoutant } = require('../../src/server');

// afterEach((done) => {
//   serverEcoutant.close();
//   done()
// });

// describe('Route users', () => {
//   it("rend une page user adaptée", (done) => {
//     request(serverEcoutant)
//       .post("/users/1")
//       .send() // send({ }) pour envoyer une requête data
//       .then((res) => {
//         expect(res.statusCode).toBe(200);
//         expect(res.text).toContains("Je m'appelle Thomas Falcone");
//         done();
//       });
//   });
// })