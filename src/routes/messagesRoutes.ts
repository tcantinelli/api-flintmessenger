import { Request, Response, Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import MessagesController from '../controllers/messages';
import { IUsers, Users } from "../models/users";
import { io } from "../socket";

const router = Router();

/* GET ALL CONVERSATIONS FROM MAIN USER */
router.get('/', authenticationRequired, async (req: Request, res: Response) => {
	if (!req.user) { return res.status(401).send('You must be authenticated') };
	try {
		const messages = await MessagesController.getMessages(req.user as IUsers);
		res.send(messages);
	} catch (_err) {
		return res.status(500).send('Server error');
	}
});

/* GET ONE CONVERSATION */
router.get('/:conversationId', authenticationRequired, async (req: Request, res: Response) => {
	if (!req.user) { return res.status(401).send('You must be authenticated') };
	try {
		const messages = await MessagesController.getMessages(req.user as IUsers, req.params['conversationId']);
		res.send(messages);
	} catch (_err) {
		return res.status(500).send('Server error');
	}
});

/* CREATE */
router.post('/', async (req: Request, res: Response) => {
	const user = req.user as IUsers;
	if (!user) { return res.status(401).send('You must be authenticated') };

	const { conversationId, targets, content, createdAt } = req.body;

	if (conversationId && targets && content) {
		const finalMessage = await MessagesController.addMessages(conversationId, user._id, targets, content, createdAt);
		res.status(201).send(finalMessage);

		//Si message à Mia
		MessagesController.getAnswerFromMia(conversationId, targets);

		return await Promise.all(
			finalMessage.targets.map(async (target) => {
			  const profile = await Users.findById(target)
			  const socketId = profile?.socket;
			  if(socketId){
				io.to(socketId).emit('chat-message', finalMessage.toJSON())
			  }
			})
		  )
	} else {
		res.status(400).send('Données manquantes');
	};
});

export default router;
