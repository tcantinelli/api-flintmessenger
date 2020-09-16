import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IUsers } from '../models/users';
import { UserNotFoundError } from '../controllers/authentification';
import { authenticationRequired } from '../middlewares/authenticationRequired';

const router = Router();

router.post('/', (req: Request, res: Response) => {
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

/* GET MAIN USER PROFILE*/
router.get("/me", authenticationRequired, (request: Request, response: Response) => {
	if(!request.user) { return response.status(401).send() }
	return response.json((request.user as IUsers).getSafeUser());
  });

export default router;