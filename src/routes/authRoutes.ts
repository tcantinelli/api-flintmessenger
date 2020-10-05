import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IUsers } from '../models/users';
import { UserNotFoundError } from '../controllers/authentification';
import UsersController from '../controllers/users';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import { io } from "../socket";

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
			await UsersController.addUsers(email, firstname, lastname, password);
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
		} catch (_err) {
			res.status(500).send('Erreur serveur');
		}
	} else {
		res.status(400).send('Données manquantes');
	}
});

/* LOGOUT */
router.get('/logout', authenticationRequired, async (req: Request, res: Response) => {
	const user = req.user as IUsers;

	if (!user) { return res.status(401).send('You must be authenticated') };
	req.logout()
	req.session?.destroy((error) => {
		if (error) {
			return res.status(200).send('User logout success but session not destroy')
		}
		else {
			res.clearCookie('session_id');
			req.session = undefined;
			//Stop socket connection
			if (user.socket) io.sockets.sockets[user.socket].disconnect();
			return res.status(200).send('User logout success')
		}
	})
})

/* DELETE MAIN USER */
router.delete('/bye', authenticationRequired, async (req: Request, res: Response) => {
	const theUser = (req.user as IUsers);
	if (!theUser) { return res.status(401).send('You must be authenticated') };

	try {
		const deletedUser = await UsersController.deleteUsers(theUser._id);
		if (deletedUser == null) { res.status(404).send("Utilisateur inconnu"); return; }
		res.clearCookie('session_id');
		req.session = undefined;
		//Stop socket connection
		if (deletedUser.socket) io.sockets.sockets[deletedUser.socket].disconnect();
		res.status(200).send('L\'utilisateur a été supprimé');
	} catch (_err) {
		res.status(500).send("Il y a eu une erreur serveur");
	}
});

export default router;