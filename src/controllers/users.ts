import { Users, IUsers } from "../models/users";

const UsersController = {
	async getUser(userID: string): Promise<IUsers | null> {
		const user = await Users.findById(userID);
		return user;
	},

	async getUsers(): Promise<IUsers[]> {
		const users = await Users.find({});
		return users;
	},

	async deleteUsers(userId: string): Promise<IUsers | null> {
		const user = await Users.findByIdAndDelete(userId);
		return user;
	},

	async addUsers(email: string, firstname: string, lastname: string, password: string): Promise<IUsers> {
		const newUser = new Users({ email, firstname, lastname })

		newUser.setPassword(password);

		try {
			const user = await newUser.save();
			return user;
		} catch (_err) {
			throw new Error();
		}
	}

}

export default UsersController;