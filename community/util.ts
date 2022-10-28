import type {HydratedDocument, Types} from 'mongoose';
import type {Community, PopulatedCommunity} from '../community/model';
import { constructUserResponse, UserResponse } from '../user/util';
import { constructFreetResponse, FreetResponse } from '../freet/util';
import { User } from '../user/model';
import { Freet } from '../freet/model';
import CommunityCollection from './collection';

export type CommunityResponse = {
  _id: string;
  name: string;
  members: Array<UserResponse> | number;
  freets: Array<FreetResponse> | number;
  inCommunity: boolean;
};

const constructCommunityResponse = async (community: HydratedDocument<Community>, userId: Types.ObjectId | string): Promise<CommunityResponse> => {
  const populatedCommunity = await community.populate('members freets') as PopulatedCommunity;
  populatedCommunity.freets.sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime());
  return {
    _id: populatedCommunity._id.toString(),
    name: populatedCommunity.name,
    members: populatedCommunity.members.map(m => constructUserResponse(m as HydratedDocument<User>)),
    freets: await Promise.all(populatedCommunity.freets.map(m => constructFreetResponse(m as HydratedDocument<Freet>, userId))),
    inCommunity: await CommunityCollection.isUserInCommunity(community._id, userId)
  };
};

const constructCommunityResponseNoPopulate = async (community: HydratedDocument<Community>, userId: Types.ObjectId | string): Promise<CommunityResponse> => {
  return {
    _id: community._id.toString(),
    name: community.name,
    members: community.members.length,
    freets: community.freets.length,
    inCommunity: await CommunityCollection.isUserInCommunity(community._id, userId)
  };
};

export {
  constructCommunityResponse,
  constructCommunityResponseNoPopulate
};