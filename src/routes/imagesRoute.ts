import { Request, Response, Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import * as fs from 'fs';
import * as path from 'path';
import { IUsers } from '../models/users';


const router = Router();

/* GET MAIN USER DATAS*/
router.get("/:fileName", authenticationRequired, async (req: Request, res: Response) => {
	const theUser = (req.user as IUsers);
	if (!theUser) { return res.status(401).send('You must be authenticated') };
	const { fileName } = req.params;
	res.setHeader('Content-Type', 'image/jpeg');
	fs.createReadStream(path.join(__dirname, `../images/${fileName}`)).pipe(res);
});

export default router;
