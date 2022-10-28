import FreetCollection from "../freet/collection";
import { Types, HydratedDocument } from "mongoose";
import LikeModel from "./model";
import {Like} from './model';

class LikeCollection {

  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      user: userId,
      likedFreets: [],
    });

    await like.save();
    return like;
  }

  static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({user: userId});
  }

  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    return LikeModel.find();
  }

  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.findOne({user: userId});
    for (const f of like.likedFreets)
      await FreetCollection.deleteLikeFromFreet(f, userId);

    const deleted = await LikeModel.deleteOne({user: userId});
    return deleted !== null;
  }

  static async addLikeToFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = await LikeModel.findOne({user: userId});
    like.likedFreets.push(freetId as Types.ObjectId);

    await FreetCollection.addLikeToFreet(freetId, userId);
    await like.save();
    return like;
  }

  static async deleteLikeFromFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = await LikeModel.findOne({user: userId});
    const idx = like.likedFreets.indexOf(freetId as Types.ObjectId);
    like.likedFreets.splice(idx, 1);

    await FreetCollection.deleteLikeFromFreet(freetId, userId);
    await like.save();
    return like;
  }

  static async didUserLikeFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.findOne({user: userId});
    const idx = like.likedFreets.indexOf(freetId as Types.ObjectId);
    return idx !== -1;
  }

}

export default LikeCollection;
