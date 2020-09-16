import { Request, Response, Router } from 'express';
import { Messages } from '../models/messages';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	const { conversationId, emitter, targets, content } = req.body;

	if (conversationId && emitter && targets) {
		const newMessage = new Messages({ conversationId, emitter, targets, content });

		try {
			const finalMessage = await newMessage.save();
			res.status(201).send(finalMessage);
		} catch (err) {
			res.status(400).send('Données manquantes');
		};
	};
});

export default router;