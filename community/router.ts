import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommunityCollection from './collection';
import * as userValidator from '../user/middleware';
import * as communityValidator from '../community/middleware';
import * as util from './util';
import { HydratedDocument, Types } from 'mongoose';
import { Community } from './model';

const router = express.Router();

// GET /api/communities
// get all communities
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const allCommunities = await CommunityCollection.findAll();
    const response = await Promise.all(allCommunities.map(m => util.constructCommunityResponseNoPopulate(m, req.session.userId)));
    res.status(200).json(response);
  }
);

// POST /api/communities
// create a new community
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isValidCommunityName,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const community = await CommunityCollection.addOne(req.body.name, userId);
    res.status(201).json({
      message: 'Community created.',
      community: await util.constructCommunityResponse(community, userId)
    });
  }
);

// GET /api/communities/:communityId?
// get a community
router.get(
  '/view/:communityId?',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExists,
    communityValidator.isUserInCommunity,
  ],
  async (req: Request, res: Response) => {
    const community = await CommunityCollection.findOne(req.params.communityId);
    const response = await util.constructCommunityResponse(community, req.session.userId);
    res.status(200).json(response);
  }
);

// GET /api/communities/user
// get my communities
router.get(
  '/user',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const communities = await CommunityCollection.getCommunitiesForUser(req.session.userId);
    const response = await Promise.all(communities.map(m => util.constructCommunityResponseNoPopulate(m as HydratedDocument<Community>, req.session.userId)));
    res.status(200).json(response);
  }
);

// // GET /api/communities/user/:communityId?
// // gets status in community
// router.get(
//   '/user/:communityId?',
//   [
//     userValidator.isUserLoggedIn,
//     communityValidator.isCommunityExists,
//   ],
//   async (req: Request, res: Response) => {
//     const community = await CommunityCollection.findOne(req.params.communityId);
//     const userId = req.session.userId;
//     const idx = community.members.indexOf(userId as Types.ObjectId);
//     res.status(200).json(idx !== -1);
//   }
// );

// PUT /api/communities/user/:communityId?
// toggle user's joined status in community
router.put(
  '/user/:communityId?',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExists,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const communityId = req.params.communityId;
    const community = await CommunityCollection.isUserInCommunity(communityId, userId) ? await CommunityCollection.deleteUserFromCommunity(communityId, userId) : await CommunityCollection.addUserToCommunity(communityId, userId);
    res.status(200).json({
      message: 'Toggled successfully.',
      community: await util.constructCommunityResponse(community, userId),
    });
  }
);


export {router as communityRouter};
