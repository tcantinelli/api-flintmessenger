import { Document, Schema, model, Model } from 'mongoose';

export interface IMessage extends Document {
	conversationId: string;
	emitter: string;
	targets: string[];
	createdAt: Date;
	content: string;
}

const messageSchema = new Schema({
	conversationId: { type: String, required: true },
	emitter: {
		type: Schema.Types.ObjectId,
		ref: 'profile',
		required: true
	},
	targets: [{
		type: Schema.Types.ObjectId,
		ref: 'profile'
	}],
	createdAt: { type: Date, default: new Date() },
	content: { type: String, required: true }
});

export const Message = model<IMessage, Model<IMessage>>("message", messageSchema);
