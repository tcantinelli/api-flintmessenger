import { Request, Response, Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import UsersController from '../controllers/users';
import { IUsers } from '../models/users';
import { io } from "../socket";

const router = Router();

/* GET MAIN USER DATAS*/
router.get("/me", authenticationRequired, async (req: Request, res: Response) => {
	const theUser = (req.user as IUsers);
	if (!theUser) { return res.status(401).send('You must be authenticated') };
	return res.send(theUser.getSafeUser());
});

/* GET ONE*/
router.get('/:userId', authenticationRequired, async (req: Request, res: Response) => {
	if (!req.user) { return res.status(401).send('You must be authenticated') };
	const { userId } = req.params;

	try {
		const user = await UsersController.getUser(userId);
		if (user === null) { return res.status(404).send("User not found"); }
		return res.send(user.getSafeUser());
	} catch (_err) {
		return res.status(500).send()
	}
});

/* GET ALL */
router.get('/', authenticationRequired, async (req: Request, res: Response) => {
	if (!req.user) { return res.status(401).send('You must be authenticated') };
	try {
		const users = await UsersController.getUsers();
		const safeUsers = users.map(user => user.getSafeUser());
		return res.status(200).send(safeUsers);
	} catch (_err) {
		return res.status(500).send();
	}
});

/* UPDATE USER */
router.patch('/', authenticationRequired, async (req: Request, res: Response) => {
	const theUser = (req.user as IUsers);
	if (!theUser) { return res.status(401).send('You must be authenticated') };
	try {
		const { email, firstname, lastname, password } = req.body;

		if (email && firstname && lastname) {
			try {
				const user = await UsersController.updateUsers(theUser, email, firstname, lastname, password);
				res.status(200).send(user?.getSafeUser());
			} catch (_err) {
				res.status(500).send('Erreur serveur');
			}
		} else {
			res.status(400).send('Données manquantes');
		}
	} catch (_err) {
		return res.status(500).send();
	}
})

/* SET CONVERSATION SEEN */
router.patch('/saw', authenticationRequired, async (req: Request, res: Response) => {
	const theUser = (req.user as IUsers);
	if (!theUser) { return res.status(401).send('You must be authenticated') };
	try {
		const { conversationId, dateSeen } = req.body;
		if (!conversationId || !dateSeen) return res.status(500).send();
		const user = await UsersController.setConversationSeen(theUser, conversationId, dateSeen);

		//Send the notification to other targeted users
		io.emit('user-update', user.getSafeUser());
		return res.status(200).send(user?.getSafeUser());
	} catch (_err) {
		return res.status(500).send();
	}
})

export default router;
