import { Request, Response, Router } from 'express'
import { Profile } from '../models/profiles';

const router = Router();

router.get('/:profileId', (req: Request, res: Response) => {
	const { profileId } = req.params;

	Profile.findById(profileId, (err, profile) => {
		if (err) res.status(500).send("Il y a eu une erreur serveur");
		if (profile == null) { res.status(404).send("Il y a eu une erreur"); return; }

		res.status(200).send(profile);
	});
});

router.post('/', (req: Request, res: Response) => {
	const { email, firstname, lastname } = req.body;

	if (email && firstname && lastname) {
		const newProfile = new Profile({ email: email, firstname: firstname, lastname: lastname })

		newProfile.save()
			.then(newProfileSaved => {
				res.status(201).send({
					id: newProfileSaved._id,
					email, firstname, lastname
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).send('Erreur serveur');
			})

	} else {
		res.status(400).send('Données manquantes');
	}
});

export default router;