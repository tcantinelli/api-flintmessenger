import { Request, Response, Router } from 'express'
import { Profile } from '../models/profiles';

const router = Router();

/* GET */
router.get('/:profileId', (req: Request, res: Response) => {
	const { profileId } = req.params;

	Profile.findById(profileId, '-password -__v', (err, profile) => {
		if (err) res.status(500).send("Il y a eu une erreur serveur");
		if (profile == null) { res.status(404).send("Il y a eu une erreur"); return; }

		res.status(200).send(profile);
	});
});

/* DELETE */
router.delete('/:profileId', (req: Request, res: Response) => {
	const { profileId } = req.params;

	Profile.findByIdAndDelete(profileId, (err, profile) => {
		if (err) res.status(500).send("Il y a eu une erreur serveur");
		if (profile == null) { res.status(404).send("Profile inconnu"); return; }
		res.status(200).send('Le profile a été supprimé');
	});
});

/* CREATE */
router.post('/', (req: Request, res: Response) => {
	const { email, firstname, lastname, password } = req.body;

	if (email && firstname && lastname) {
		const newProfile = new Profile({ email: email, firstname: firstname, lastname: lastname })

		newProfile.setPassword(password);

		newProfile.save((err, profile) => {
			if (err) res.status(500).send('Erreur serveur');
			res.status(201).send({
				id: profile._id,
				email, firstname, lastname
			});
		});
	} else {
		res.status(400).send('Données manquantes');
	}
});

export default router;