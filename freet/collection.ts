import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import CommunityCollection from '../community/collection';
import LikeCollection from '../like/collection';
import ControversialCollection from '../controversial/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, community: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      likers: [],
      conters: [],
    });
    if (community.toString().length > 0) {
      freet.community = community as Types.ObjectId;
      await CommunityCollection.addFreetToCommunity(community, freet._id);
    }
    await freet.save(); // Saves freet to MongoDB
    return freet;
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId});
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({community : {$exists : false}}).sort({dateModified: -1});
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id, community: {$exists : false}}).sort({dateModified: -1});
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const toDelete = await FreetModel.findOne({_id: freetId});
    if (toDelete.community)
      await CommunityCollection.deleteFreetFromCommunity(toDelete.community, freetId);
    for (const l of toDelete.likers) 
      await LikeCollection.deleteLikeFromFreet(l, freetId);
    for (const c of toDelete.conters)
      await ControversialCollection.deleteControversialFromFreet(c, freetId);
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    const userFreets = await FreetModel.find({authorId, community: {$exists : true}}); //retrieve freets in community
    for (const freet of userFreets)
      CommunityCollection.deleteFreetFromCommunity(freet.community, freet._id);

    await FreetModel.deleteMany({authorId});
  }

  static async addLikeToFreet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.likers.push(userId as Types.ObjectId);

    await freet.save();
    return freet;
  }

  static async deleteLikeFromFreet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    const idx = freet.likers.indexOf(userId as Types.ObjectId);
    freet.likers.splice(idx, 1);

    await freet.save();
    return freet;
  }

  static async addControversialToFreet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.conters.push(userId as Types.ObjectId);

    await freet.save();
    return freet;
  }

  static async deleteControversialFromFreet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    const idx = freet.conters.indexOf(userId as Types.ObjectId);
    freet.conters.splice(idx, 1);

    await freet.save();
    return freet;
  }
}

export default FreetCollection;
