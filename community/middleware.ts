import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommunityCollection from './collection';

const isValidCommunityName = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name.trim()) {
    res.status(400).json({
      error: {
        name: 'Community name must not be empty.'
      }
    });
    return;
  }

  next();
};

const isUserInCommunity = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await CommunityCollection.isUserInCommunity(req.params.communityId, req.session.userId))) {
    res.status(403).json({
      error: {
        name: 'User is not in community.'
      }
    });
    return;
  }

  next();
}

const isCommunityExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.communityId);
  const community = validFormat ? await CommunityCollection.findOne(req.params.communityId) : '';
  if (!community) {
    res.status(404).json({
      error: {
        freetNotFound: `Community with community ID ${req.params.communityId} does not exist.`
      }
    });
    return;
  }

  next();
}

export {
  isValidCommunityName,
  isUserInCommunity,
  isCommunityExists
}