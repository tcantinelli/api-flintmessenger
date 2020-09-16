import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IUsers } from '../models/users';
import { UserNotFoundError } from '../controllers/authentification';
import UsersController from '../controllers/users';

const router = Router();

/* LOGIN */
router.post('/login', (req: Request, res: Response) => {
	passport.authenticate('local', (err, user: IUsers) => {
		if (err) {
			return err instanceof UserNotFoundError
				? res.status(404).send('User not found')
				: res.status(500).send('Il y a eu une erreur')
		}

		if (user) {
			// Creer une session avec req.logIn / express Session
			req.logIn(user, (err) => {
				if (err) return res.status(500).send("Erreur pendant la connexion");
				return res.send(user.getSafeUser());
			})
		} else {
			return res.status(401).send('Il ya une erreur');
		}
	})(req, res);
});

/* REGISTER */
router.post('/register', async (req: Request, res: Response) => {
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

export default router;