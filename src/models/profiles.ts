import { Document, Schema, model, Model } from 'mongoose';
import { SHA256 } from 'crypto-js';

export interface IProfile extends Document {
	email: string;
	lastname: string;
	firstname: string;
	getFullname: () => string;
	setPassword: (password: string) => void;
	verifyPassword: (password: string) => boolean;
	getSafeProfile: () => ISafeProfile;
}

const profileSchema = new Schema({
	email: { type: String, required: true, unique: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true }
});


profileSchema.methods.getFullname = function () {
	return `${this.firstname} ${this.lastname}`;
}

profileSchema.methods.setPassword = function (password: string) {
	this.password = SHA256(password).toString();
}

profileSchema.methods.verifyPassword = function (password: string) {
	return this.password === SHA256(password).toString();
}

//Type pour reponse client, sans pwd
export type ISafeProfile = Pick<IProfile, '_id' | 'email' | 'lastname' | 'firstname'>;

profileSchema.methods.getSafeProfile = function (): ISafeProfile {
	const { _id, email, lastname, firstname } = this;
	return { _id, email, lastname, firstname };
};

export const Profile = model<IProfile, Model<IProfile>>("profile", profileSchema);
