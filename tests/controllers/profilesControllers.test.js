import profilesController from '../../src/controllers/profilesController;'

let userTest = new Profile({
	_id: "5f5255c0702e060c94d4b3a3",
	email: "toto@gmail.com",
	firstname: "toto",
	lastname: "tata"
});

describe('ProfilesController', () => {
	it('retourne un Utilisateur', () => {
		const theUser = userController.find("1");
		expect(theUser.nom).toBe('Thomas');
	})
})
