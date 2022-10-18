import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommunityCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response) => {
    const allCommunities = await CommunityCollection.findAll();
    const response = allCommunities.map(util.constructCommunityResponse);
    res.status(200).json(response);
  }
)

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const community = await CommunityCollection.addOne(req.body.name, userId);
    res.status(201).json({
      message: 'Community created.',
      community: util.constructCommunityResponse(community)
    });
  }
)

router.delete(
  '/:communityId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await CommunityCollection.deleteOne(req.params.communityId);
    res.status(200).json({
      message: 'Your community was deleted successfully.'
    });
  }
)

router.put(
  '/:communityId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await CommunityCollection.updateCommunityMembers(req.params.communityId, req.body.userId);
  }
)

export {router as communityRouter};
