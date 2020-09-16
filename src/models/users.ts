import { Document, Schema, model, Model } from 'mongoose';
import { SHA256 } from 'crypto-js';

export interface IUsers extends Document {
	email: string;
	lastname: string;
	firstname: string;
	getFullname: () => string;
	setPassword: (password: string) => void;
	verifyPassword: (password: string) => boolean;
	getSafeUser: () => ISafeUsers;
}

const usersSchema = new Schema({
	email: { type: String, required: true, unique: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true }
});


usersSchema.methods.getFullname = function () {
	return `${this.firstname} ${this.lastname}`;
}

usersSchema.methods.setPassword = function (password: string) {
	this.password = SHA256(password).toString();
}

usersSchema.methods.verifyPassword = function (password: string) {
	return this.password === SHA256(password).toString();
}

//Type pour reponse client, sans pwd
export type ISafeUsers = Pick<IUsers, '_id' | 'email' | 'lastname' | 'firstname'>;

usersSchema.methods.getSafeUser = function (): ISafeUsers {
	const { _id, email, lastname, firstname } = this;
	return { _id, email, lastname, firstname };
};

export const Users = model<IUsers, Model<IUsers>>("users", usersSchema);
