import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import FreetCollection from '../freet/collection';
import { constructFreetResponse } from '../freet/util';
import { Freet } from '../freet/model';
import { HydratedDocument } from 'mongoose';
import { PopulatedLike } from './model';
import UserCollection from '../user/collection';

const router = express.Router();

// GET /api/likes
// get user's liked freets
router.get(
  '/?user=userId',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.findOne((await UserCollection.findOneByUsername(req.query.user as string))._id);
    // const like = await LikeCollection.findOne(req.params.userId);
    const populatedLike = await like.populate('likedFreets') as PopulatedLike;
    const response = await Promise.all(populatedLike.likedFreets.map(m => constructFreetResponse(m as HydratedDocument<Freet>, req.session.userId)));
    res.status(200).json(response);
  }
);

// PUT /api/likes/:freetId?
// toggle like on freet
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const freetId = req.params.freetId;
    await LikeCollection.didUserLikeFreet(userId, freetId) ? await LikeCollection.deleteLikeFromFreet(userId, freetId) : await LikeCollection.addLikeToFreet(userId, freetId);
    const freet = await FreetCollection.findOne(freetId);
    res.status(200).json({
      message: 'Toggled successfully.',
      freet: await constructFreetResponse(freet, userId),
    });
  }
);


export {router as likeRouter};
