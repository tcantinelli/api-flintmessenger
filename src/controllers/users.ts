import { Users, IUsers } from "../models/users";
import MessagesController from "./messages";

const UsersController = {
	async getUser(userID: string): Promise<IUsers | null> {
		const user = await Users.findById(userID);
		return user;
	},

	async getUsers(): Promise<IUsers[]> {
		//Pour classer users connected en premier (classés asc) PUIS users offline (asc)
		const connectedUsers = await Users.find({ connected: true }).sort({ firstname: 1 });
		const disconnectedUsers = await Users.find({$or: [{ connected: { $exists: false}},  { connected: { $ne: true } }]}).sort({ firstname: 1 });
		return connectedUsers.concat(disconnectedUsers);
	},

	async deleteUsers(userId: string): Promise<IUsers | null> {
		const user = await Users.findByIdAndDelete(userId);
		return user;
	},

	async updateUsers(user: IUsers, email: string, firstname: string, lastname: string, password: string): Promise<IUsers | null> {

		user.email = email;
		user.firstname = firstname;
		user.lastname = lastname;

		if (password.length > 0) user.setPassword(password);

		const upUser = await user.save();
		return upUser;
	},

	async addUsers(email: string, firstname: string, lastname: string, password: string): Promise<IUsers> {
		const newUser = new Users({ email, firstname, lastname })

		newUser.setPassword(password);

		try {
			const user = await newUser.save();
			await MessagesController.startConversationWithMia(user._id);
			return user;
		} catch (_err) {
			throw new Error();
		}
	},

	async setConversationSeen(user: IUsers, conversationId: string, dateSeen: string) {
		try {
			user.updateSeen(conversationId, dateSeen);
			const upUser = await user.save();
			return upUser;
		} catch (_err) {
			throw new Error();
		}
	}
}

export default UsersController;