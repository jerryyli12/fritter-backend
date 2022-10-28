import FreetCollection from "../freet/collection";
import { Types, HydratedDocument } from "mongoose";
import ControversialModel from "./model";
import {Controversial} from './model';

class ControversialCollection {

  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Controversial>> {
    const controversial = new ControversialModel({
      user: userId,
      contedFreets: [],
      contSetting: false
    });

    await controversial.save();
    return controversial;
  }

  static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Controversial>> {
    return ControversialModel.findOne({user: userId});
  }

  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    return ControversialModel.find();
  }

  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const controversial = await ControversialModel.findOne({user: userId});
    for (const f of controversial.contedFreets)
      await FreetCollection.deleteControversialFromFreet(f, userId);

    const deleted = await ControversialModel.deleteOne({user: userId});
    return deleted !== null;
  }

  static async addControversialToFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Controversial>> {
    const controversial = await ControversialModel.findOne({user: userId});
    controversial.contedFreets.push(freetId as Types.ObjectId);

    await FreetCollection.addControversialToFreet(freetId, userId);
    await controversial.save();
    return controversial;
  }

  static async deleteControversialFromFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Controversial>> {
    const controversial = await ControversialModel.findOne({user: userId});
    const idx = controversial.contedFreets.indexOf(freetId as Types.ObjectId);
    controversial.contedFreets.splice(idx, 1);

    await FreetCollection.deleteControversialFromFreet(freetId, userId);
    await controversial.save();
    return controversial;
  }

  static async didUserControversialFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const controversial = await ControversialModel.findOne({user: userId});
    const idx = controversial.contedFreets.indexOf(freetId as Types.ObjectId);
    return idx !== -1;
  }

}

export default ControversialCollection;
