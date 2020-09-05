import { Profile } from '../../src/models/profiles';

const userTest = new Profile({
	email: "thomas@mail.com",
	lastname: "Toto",
	firstname: "Thomas"
});

describe('Profile: GetFullName', () => {
  it("renvoie le prénom et le nom de l'utilisateur", () => {
	expect(userTest.getFullname()).toBe("Thomas Toto");
  });
})
