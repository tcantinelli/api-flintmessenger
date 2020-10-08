import { Document, Schema, model, Model } from 'mongoose';

export interface IMessages extends Document {
	conversationId: string;
	emitter: string;
	targets: string[];
	createdAt: Date;
	content: string;
}

const messagesSchema = new Schema({
	conversationId: { type: String, required: true },
	emitter: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	targets: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	createdAt: { type: Date, default: new Date() },
	content: { type: String, required: true }
});

export const Messages = model<IMessages, Model<IMessages>>("messages", messagesSchema);
