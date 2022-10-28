import type {HydratedDocument, Types} from 'mongoose';
import type {Community, PopulatedCommunity} from './model';
import CommunityModel from './model';
import UserCollection from '../user/collection';
import { PopulatedUser } from '../user/model';


class CommunityCollection {

  static async addOne(name: string, creatorId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = new CommunityModel({
      name: name,
      members: [creatorId],
      freets: []
    });

    await UserCollection.addUserToCommunity(creatorId, community._id);
    await community.save();
    return community;
  }

  static async findOne(communityId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    return CommunityModel.findOne({_id: communityId});
  }

  static async findAll(): Promise<Array<HydratedDocument<Community>>> {
    return CommunityModel.find();
  }

  static async deleteOne(communityId: Types.ObjectId | string): Promise<boolean> {
    const community = await CommunityModel.deleteOne({_id: communityId});
    return community !== null;
  }

  static async isUserInCommunity(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<boolean> {
    const community = await CommunityModel.findOne({_id: communityId});
    const idx = community.members.indexOf(userId as Types.ObjectId);
    return (idx !== -1);
  }

  static async addUserToCommunity(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    community.members.push(userId as Types.ObjectId);

    await UserCollection.addUserToCommunity(userId, communityId);
    await community.save();
    return community;
  }

  static async deleteUserFromCommunity(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    const index = community.members.indexOf(userId as Types.ObjectId);
    community.members.splice(index, 1);

    await UserCollection.deleteUserFromCommunity(userId, communityId);
    await community.save();
    return community;
  }

  static async addFreetToCommunity(communityId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    community.freets.push(freetId as Types.ObjectId);
    
    await community.save();
    return community;
  }

  static async deleteFreetFromCommunity(communityId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<void> {
    const community = await CommunityModel.findOne({_id: communityId});
    const index = community.freets.indexOf(freetId as Types.ObjectId);
    community.freets.splice(index, 1);
    await community.save();
    return;
  }

  static async getCommunitiesForUser(userId: Types.ObjectId | string): Promise<Array<Community>> {
    const user = await UserCollection.findOneByUserId(userId);
    const populatedUser = await user.populate('communities') as PopulatedUser;
    return populatedUser.communities;
  }

}

export default CommunityCollection;
