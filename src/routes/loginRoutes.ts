import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IProfile } from '../models/profiles';

const router = Router();

router.post('/', (req: Request, res: Response) => {
	passport.authenticate('local', (err, profile: IProfile) => {
		if (err) return res.status(500).send("Erreur serveur");
		if (profile) {
			// Creer une session avec req.logIn / express Session
			req.logIn(profile, (err) => {
				if (err) return res.status(500).send("Erreur pendant la connexion");
				return res.send(req.session);
			})
		} else {
			console.log(profile);
			return res.status(401).send('Il ya une erreur');
		}
	})(req, res);
});

export default router;