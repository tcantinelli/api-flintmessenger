import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IProfile } from '../models/profiles';
import { ProfileNotFoundError } from '../controllers/authentification';

const router = Router();

router.post('/', (req: Request, res: Response) => {
	passport.authenticate('local', (err, profile: IProfile) => {
		if (err) {
			return err instanceof ProfileNotFoundError
				? res.status(404).send('Profile not found')
				: res.status(500).send('Il y a eu une erreur')
		}

		if (profile) {
			// Creer une session avec req.logIn / express Session
			req.logIn(profile, (err) => {
				if (err) return res.status(500).send("Erreur pendant la connexion");
				return res.send(profile.getSafeProfile());
			})
		} else {
			return res.status(401).send('Il ya une erreur');
		}
	})(req, res);
});

export default router;