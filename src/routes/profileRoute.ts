import { Request, Response, Router } from 'express';
import { Profile } from '../models/profiles';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import { getAllProfiles, getProfile } from '../controllers/profiles';

const router = Router();

/* GET */
router.get('/:profileId', authenticationRequired, (req: Request, res: Response) => {
	const { profileId } = req.params;

	getProfile(profileId)
		.then(profile => {
			if (profile === null) { return res.status(404).send("Profile not found"); }
			return res.send(profile.getSafeProfile());
		}).catch(error => {
			console.error(error);
			return res.status(500).send()
		});
});

/* DELETE */
router.delete('/:profileId', authenticationRequired, (req: Request, res: Response) => {
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
			res.status(201).send(profile.getSafeProfile());
		});
	} else {
		res.status(400).send('Données manquantes');
	}
});

/* GET ALL PROFILES */
router.get('/', (req: Request, res: Response) => {
	getAllProfiles()
		.then(profiles => profiles.map(profile => profile.getSafeProfile()))
		.then(safeProfiles => {
			return res.status(200).send(safeProfiles);
		})
		.catch(error => {
			console.error(error);
			return res.status(500).send();
		})
});

export default router;