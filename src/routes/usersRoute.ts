import { Request, Response, Router } from 'express';
import { Users } from '../models/users';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import { getUsers, getUser } from '../controllers/profiles';

const router = Router();

/* GET */
router.get('/:userId', authenticationRequired, (req: Request, res: Response) => {
	const { userId } = req.params;

	getUser(userId)
		.then(user => {
			if (user === null) { return res.status(404).send("User not found"); }
			return res.send(user.getSafeUser());
		}).catch(error => {
			console.error(error);
			return res.status(500).send()
		});
});

/* DELETE */
router.delete('/:userId', authenticationRequired, (req: Request, res: Response) => {
	const { userId } = req.params;

	Users.findByIdAndDelete(userId, (err, user) => {
		if (err) res.status(500).send("Il y a eu une erreur serveur");
		if (user == null) { res.status(404).send("Utilisateur inconnu"); return; }
		res.status(200).send('L\'utilisateur a été supprimé');
	});
});

/* CREATE */
router.post('/', (req: Request, res: Response) => {
	const { email, firstname, lastname, password } = req.body;

	if (email && firstname && lastname) {
		const newUser = new Users({ email: email, firstname: firstname, lastname: lastname })

		newUser.setPassword(password);

		newUser.save((err, user) => {
			if (err) res.status(500).send('Erreur serveur');
			res.status(201).send(user.getSafeUser());
		});
	} else {
		res.status(400).send('Données manquantes');
	}
});

/* GET ALL PROFILES */
router.get('/', (req: Request, res: Response) => {
	getUsers()
		.then(profiles => profiles.map(profile => profile.getSafeUser()))
		.then(safeProfiles => {
			return res.status(200).send(safeProfiles);
		})
		.catch(error => {
			console.error(error);
			return res.status(500).send();
		})
});

export default router;