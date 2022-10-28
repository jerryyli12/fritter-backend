import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ControversialCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import FreetCollection from '../freet/collection';
import { constructFreetResponse } from '../freet/util';

const router = express.Router();

// GET /api/controversials
// get my controversial setting
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const controversial = await ControversialCollection.findOne(req.session.userId);
    res.status(200).json(controversial.contSetting);
  }
);

// PUT /api/controversials
// toggle user's controversial setting
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const controversial = await ControversialCollection.findOne(req.session.userId);
    controversial.contSetting = !controversial.contSetting;
    await controversial.save();
    res.status(200).json({
      message: 'Toggled successfully.',
      setting: controversial.contSetting
    });
  }
);

// PUT /api/controversials/:freetId?
// toggle controversial on freet
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const freetId = req.params.freetId;
    await ControversialCollection.didUserControversialFreet(userId, freetId) ? await ControversialCollection.deleteControversialFromFreet(userId, freetId) : await ControversialCollection.addControversialToFreet(userId, freetId);
    const freet = await FreetCollection.findOne(freetId);
    res.status(200).json({
      message: 'Toggled successfully.',
      freet: await constructFreetResponse(freet, userId),
    });
  }
);


export {router as controversialRouter};
