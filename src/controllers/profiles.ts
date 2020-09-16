import { Users, IUsers } from "../models/users";

export function getUser(userID: string): Promise<IUsers | null>{
  return Users.findById(userID).then(user => user);
}

export function getUsers(): Promise<IUsers[]>{
  return Users.find({}).then(users => users);
}