import { Request, Response, Router } from 'express'
import passport from 'passport';

const router = Router();

router.post('/', (req: Request, res: Response) => {
	passport.authenticate('local', (err, profile) => {
		if (err) return res.status(500).send("Erreur serveur");
		if (profile) {

			//Créer session
		} else {
			return res.status(401).send('Il ya une erreur');
		}
	})
});

export default router;