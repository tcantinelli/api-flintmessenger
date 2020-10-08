import { Users } from '../../src/models/users';

const userTest = new Users({
	email: "thomas@mail.com",
	lastname: "Toto",
	firstname: "Thomas"
});

describe('Users: GetFullName', () => {
  it("renvoie le prénom et le nom de l'utilisateur", () => {
	expect(userTest.getFullname()).toBe("Thomas Toto");
  });
});
