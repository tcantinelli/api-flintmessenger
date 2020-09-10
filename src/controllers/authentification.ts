import { Strategy } from 'passport-local';
import passport from 'passport';
import { Profile, IProfile } from '../models/profiles';
import { Handler } from "express";

const localOptions = { usernameField: 'email' };

passport.use(
	new Strategy(localOptions, (username: string, password: string, done) => {
	// new Strategy((username: string, password: string, done) => {
		try {
			Profile.findOne({ email: username }, null, (err, profile) => {
				if (err) return done(err);
				if (profile) {
					const hasCorrectPassword = profile.verifyPassword(password);
					if (hasCorrectPassword) return done(null, profile);
				}
				return done(new ProfileNotFoundError("Profile not found"));
			});
		} catch (error) { done(error) }
	})
);

passport.serializeUser(
	({ _id }: IProfile, done) => { done(null, _id) }
);

passport.deserializeUser(
	(_id, done) => {
		Profile.findById(_id, (err, profile) => {
			console.log(err);
			if (err) { return done(err) };
			return done(undefined, profile);
		});
	})

export const authenticationInitialize = (): Handler => passport.initialize();
export const authenticationSession = (): Handler => passport.session();
export class ProfileNotFoundError extends Error {};
