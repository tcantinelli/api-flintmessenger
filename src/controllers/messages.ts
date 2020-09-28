import { Messages, IMessages } from "../models/messages";
import { IUsers } from "../models/users";

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
	}

}

export default MessagesController;