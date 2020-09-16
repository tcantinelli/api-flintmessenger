import { Request, Response, Router } from 'express';
import { Users } from '../models/users';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import UsersController from '../controllers/users';

const router = Router();

/* GET ONE*/
router.get('/:userId', authenticationRequired, async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		const user = await UsersController.getUser(userId);
		if (user === null) { return res.status(404).send("User not found"); }
		return res.send(user.getSafeUser());
	} catch (_err) {
		return res.status(500).send()
	}
});

/* DELETE */
router.delete('/:userId', authenticationRequired, async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		const deletedUser = await UsersController.deleteUsers(userId);
		if (deletedUser == null) { res.status(404).send("Utilisateur inconnu"); return; }
		res.status(200).send('L\'utilisateur a été supprimé');
	} catch (_err) {
		res.status(500).send("Il y a eu une erreur serveur");
	}
});

/* CREATE */
router.post('/', async (req: Request, res: Response) => {
	const { email, firstname, lastname, password } = req.body;

	if (email && firstname && lastname) {
		try {
			const user = await UsersController.addUsers(email, firstname, lastname, password);
			res.status(201).send(user.getSafeUser());
		} catch (_err) {
			res.status(500).send('Erreur serveur');
		}
	} else {
		res.status(400).send('Données manquantes');
	}
});

/* GET ALL */
router.get('/', async (_req: Request, res: Response) => {
	try {
		const users = await UsersController.getUsers();
		const safeUsers = users.map(user => user.getSafeUser());
		return res.status(200).send(safeUsers);
	} catch (_err) {
		return res.status(500).send();
	}
});

export default router;