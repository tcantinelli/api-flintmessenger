import { Strategy } from 'passport-local';
import passport from 'passport';
import { Users, IUsers } from '../models/users';
import { Handler } from "express";

const localOptions = { usernameField: 'email' };

passport.use(
	new Strategy(localOptions, (username: string, password: string, done) => {
	// new Strategy((username: string, password: string, done) => {
		try {
			Users.findOne({ email: username }, null, (err, user) => {
				if (err) return done(err);
				if (user) {
					const hasCorrectPassword = user.verifyPassword(password);
					if (hasCorrectPassword) return done(null, user);
				}
				return done(new UserNotFoundError("Users not found"));
			});
		} catch (error) { done(error) }
	})
);

passport.serializeUser(
	({ _id }: IUsers, done) => { done(null, _id) }
);

passport.deserializeUser(
	(_id, done) => {
		Users.findById(_id, (err, user) => {
			console.log(err);
			if (err) { return done(err) };
			return done(undefined, user);
		});
	})

export const authenticationInitialize = (): Handler => passport.initialize();
export const authenticationSession = (): Handler => passport.session();
export class UserNotFoundError extends Error {};
