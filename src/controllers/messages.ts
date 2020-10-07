import { Messages, IMessages } from "../models/messages";
import { IUsers, Users } from "../models/users";
import { io } from "../socket";
import UsersController from "./users";

export const miaID = '5f7d6c70c2f4b72c04a6bf3e';

const MessagesController = {
	async getMessages(user: IUsers, conversationId?: string): Promise<IMessages[]> {
		try {
			const userId = user._id;
			const query: { $or: any, $and?: any } = {
				$or: [
					{ emitter: userId },
					{ targets: userId }
				],
				$and: [{ conversationId: conversationId }]
			}
			if (!conversationId) delete query.$and
			const messages = await Messages.find(
				query,
				null,
				{ sort: { createdAt: 1 } });
			return messages;
		} catch (error) {
			throw new Error("Error while searching for messages in DB")
		}
	},

	async deleteMessages(messageID: string): Promise<IMessages | null> {
		const message = await Messages.findByIdAndDelete(messageID);
		return message;
	},

	async addMessages(conversationId: string, emitter: string, targets: string[], content: string, createdAt: Date): Promise<IMessages> {
		const newMessage = new Messages({ conversationId, emitter, targets, content, createdAt });

		try {
			const message = await newMessage.save();
			return message;
		} catch (err) {
			throw new Error();
		};
	},

	async startConversationWithMia(newUserID: string): Promise<void> {
		const conversationId = Buffer.from([miaID, newUserID, new Date().toISOString()].join('_')).toString('base64');

		const newMessage = new Messages({
			conversationId,
			targets: [miaID, newUserID],
			createdAt: new Date(),
			emitter: miaID,
			content: "Bonjour, je suis Mia l'IA de Flint Messenger, je vous souhaite la bienvenue !"
		});

		await newMessage.save();
	},

	//Send random answer after 2 sec
	async getAnswerFromMia(conversationId: string, targets: string[]): Promise<void> {

		//Update ConversationSeen de Mia
		const mia = await Users.findById(miaID);
		if (mia) {
			const miaUp = await UsersController.setConversationSeen(mia, conversationId, new Date().toISOString());
			//Send the notification to other targeted users
			io.emit('user-update', miaUp.getSafeUser());
		}

		//Réponses de Mia pour cette conversation
		const answers = await Messages.find({ conversationId: conversationId, emitter: miaID });
		const newAnswer = await getAnswer(answers.length);
		setTimeout(async () => {
			const finalMessage = await MessagesController.addMessages(conversationId, miaID, targets, newAnswer, new Date());

			return await Promise.all(
				finalMessage.targets.map(async (target) => {
					const profile = await Users.findById(target)
					const socketId = profile?.socket;
					if (socketId) {
						io.to(socketId).emit('chat-message', finalMessage.toJSON())
					}
				})
			)
		}, 2000);
	}

}

export default MessagesController;

//Get random answer from Mia
const getAnswer = async (answersCount: number): Promise<string> => {
	while (answersCount > 5) {
		answersCount -= 5;
	}

	return (miaAnswers[answersCount - 1]);
}

const miaAnswers = [
	"Il fait beau ajourd'hui non ?",
	"Bon... en fait je l'avoue je ne suis pas une IA très très maligne... ;)",
	"Le saviez-vous? Ada Lovelace a vécu au XIXème siècle et a réalisé le 1er programme informatique... FEMMES@NUMÉRIQUE !",
	"Une poule sur un mur, qui picore du pain dur...",
	"Si vous souhiatez VRAIMENT discuter, envoyez un message à Thomas C., contrairement à moi il a quelques neurones..."
];