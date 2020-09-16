import { Request, Response, Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import MessagesController from '../controllers/messages';

const router = Router();

/* DELETE */
router.delete('/:messageId', authenticationRequired, async (req: Request, res: Response) => {
	const { messageId } = req.params;

	try {
		const deletedMessage = await MessagesController.deleteMessages(messageId);
		if (deletedMessage == null) { res.status(404).send("Message inconnu"); return; }
		res.status(200).send('Le message a été supprimé');
	} catch (_err) {
		res.status(500).send("Il y a eu une erreur serveur");
	}
});

/* CREATE */
router.post('/', async (req: Request, res: Response) => {
	const { conversationId, emitter, targets, content } = req.body;

	if (conversationId && emitter && targets && content) {
		try {
			const finalMessage = await MessagesController.addMessages(conversationId, emitter, targets, content)
			res.status(201).send(finalMessage);
		} catch (err) {
			res.status(400).send('Données manquantes');
		};
	};
});

/* GET ONE */


export default router;