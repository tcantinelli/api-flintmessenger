import { Strategy } from 'passport-local';
import passport from 'passport';
import { Users, IUsers } from '../models/users';
import { Handler } from "express";

const localOptions = { usernameField: 'email' };

passport.use(
	new Strategy(localOptions, (username: string, password: string, done) => {
	// new Strategy((username: string, password: string, done) => {
		try {
			Users.findOne({ email: username }, null, (err, profile) => {
				if (err) return done(err);
				if (profile) {
					const hasCorrectPassword = profile.verifyPassword(password);
					if (hasCorrectPassword) return done(null, profile);
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
		Users.findById(_id, (err, profile) => {
			console.log(err);
			if (err) { return done(err) };
			return done(undefined, profile);
		});
	})

export const authenticationInitialize = (): Handler => passport.initialize();
export const authenticationSession = (): Handler => passport.session();
export class UserNotFoundError extends Error {};
