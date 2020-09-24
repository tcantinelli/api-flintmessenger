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

/* DELETE ONE CONVERSATION */
// router.delete('/:messageId', authenticationRequired, async (req: Request, res: Response) => {
// 	if (!req.user) { return res.status(401).send('You must be authenticated') };
// 	const { messageId } = req.params;

// 	try {
// 		const deletedMessage = await MessagesController.deleteMessages(messageId);
// 		if (deletedMessage == null) { res.status(404).send("Message inconnu"); return; }
// 		res.status(200).send('Le message a été supprimé');
// 	} catch (_err) {
// 		res.status(500).send("Il y a eu une erreur serveur");
// 	}
// });

/* CREATE */
router.post('/', async (req: Request, res: Response) => {
	const user = req.user as IUsers;
	if (!user) { return res.status(401).send('You must be authenticated') };

	const { conversationId, targets, content } = req.body;

	if (conversationId && targets && content) {
		const finalMessage = await MessagesController.addMessages(conversationId, user._id, targets, content)
		res.status(201).send(finalMessage);

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

/* GET ONE */

export default router;
