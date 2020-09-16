import { Messages, IMessages } from "../models/messages";

const MessagesController = {
	async getMessage(MessageID: string): Promise<IMessages | null> {
		const message = await Messages.findById(MessageID);
		return message;
	},

	async getMessages(): Promise<IMessages[]> {
		const messages = await Messages.find({});
		return messages;
	},

	async deleteMessages(messageID: string): Promise<IMessages | null> {
		const message = await Messages.findByIdAndDelete(messageID);
		return message;
	},

	async addMessages(conversationId: string, emitter: string, targets: string[], content: string): Promise<IMessages> {
		const newMessage = new Messages({ conversationId, emitter, targets, content });

		try {
			const message = await newMessage.save();
			return message;
		} catch (err) {
			throw new Error();
		};
	}

}

export default MessagesController;