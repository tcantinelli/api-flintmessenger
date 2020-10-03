import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { configuration, IConfig } from "./config";
import { connect } from './database';

import { authenticationInitialize, authenticationSession } from './controllers/authentification';

import messagesRoutes from './routes/messagesRoutes';
import usersRoutes from './routes/usersRoute';
import authRoutes from './routes/authRoutes';

import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import { initializeSockets } from './socket';
const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection })

export function createExpressApp(config: IConfig): express.Express {
	const { express_debug, session_secret, session_cookie_name } = config;

	const app = express();

	app.use(morgan('combined'));
	app.use(helmet());
	app.use(express.json());
	app.use(cors({
		credentials: true,
		origin: true
	}));

	const sessionConfig: session.SessionOptions = {
		name: session_cookie_name,
		secret: session_secret,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			secure: true,
			sameSite: 'none',
			httpOnly: true,
			// domain: '.safe-shore-53983.herokuapp.com'
		},
	}

	if (process.env.NODE_ENV === 'production') {
		app.set('trust proxy', 1); // trust first proxy
		sessionConfig.cookie = {
			secure: true,
			sameSite: 'none',
			httpOnly: true,
		}
	}
	app.use(session(sessionConfig))

	app.use(authenticationInitialize());
	app.use(authenticationSession());

	app.use(((err, _req, res, _next) => {
		console.error(err.stack);
		res.status(500).send(!express_debug ? 'Oups' : err);
	}) as ErrorRequestHandler);

	app.use('/messages', messagesRoutes);
	app.use('/users', usersRoutes);
	app.use('/', authRoutes);

	return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(
	() => {
		const server = app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`))
		// Initialise les sockets
		initializeSockets(config, server, sessionStore);
	}
);
