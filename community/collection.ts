import type {HydratedDocument, Types} from 'mongoose';
import type {Community} from './model';
import CommunityModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class CommunityCollection {

  static async addOne(name: string, creatorId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = new CommunityModel({
      name: name,
      members: [creatorId],
      posts: []
    });
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

  // static async getFreetsFromCommunity(): {
    
  // }

  // static async 

  // static async getCommunityMembers(communityId: Types.ObjectId | string): Promise<Array<Types.ObjectId>>{
  //   const community = await CommunityModel.findOne({_id: communityId});
  //   return community.members;
  // }

  // static async joinCommunity(communityId: Types.ObjectId | string, userId: Types.ObjectId): Promise<HydratedDocument<Community>> {
  //   const community = await CommunityModel.findOne({_id: communityId});
  //   community.members.push(userId);
  //   await community.save();
  //   return community;
  // }

  // static async leaveCommunity(communityId: Types.ObjectId | string, userId: Types.ObjectId): Promise<HydratedDocument<Community>> {
  //   const community = await CommunityModel.findOne({_id: communityId});
  //   const index = community.members.indexOf(userId);
  //   community.members.splice(index, -1);
  //   await community.save();
  //   return community;
  // }

  static async updateCommunityMembers(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    const index = community.members.indexOf((userId as Types.ObjectId));
    if (index === -1)
      community.members.push((userId as Types.ObjectId));
    else
      community.members.splice(index, 1);
    await community.save();
    return community;
  }

}

export default CommunityCollection;
