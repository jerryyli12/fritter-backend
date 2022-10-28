import LikeCollection from '../like/collection';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';
import ControversialCollection from '../controversial/collection';
import CommunityCollection from '../community/collection';
import EventCollection from '../event/collection';
import LikeModel from 'like/model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();

    const user = new UserModel({username, password, dateJoined, communities: [], attendingEvents: [], interestedEvents: []});
    await LikeCollection.addOne(user._id);
    await ControversialCollection.addOne(user._id);
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  static async addUserToCommunity(userId: Types.ObjectId | string, communityId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    user.communities.push(communityId as Types.ObjectId);
    await user.save();
    return user;
  }

  static async deleteUserFromCommunity(userId: Types.ObjectId | string, communityId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const idx = user.communities.indexOf(communityId as Types.ObjectId);
    user.communities.splice(idx, 1);
    await user.save();
    return user;
  }

  static async addUserToAttending(userId: Types.ObjectId | string, eventId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    user.attendingEvents.push(eventId as Types.ObjectId);
    await user.save();
    return user;
  }

  static async deleteUserFromAttending(userId: Types.ObjectId | string, eventId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const idx = user.attendingEvents.indexOf(eventId as Types.ObjectId);
    user.attendingEvents.splice(idx, 1);
    await user.save();
    return user;
  }

  static async addUserToInterested(userId: Types.ObjectId | string, eventId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    user.interestedEvents.push(eventId as Types.ObjectId);
    await user.save();
    return user;
  }

  static async deleteUserFromInterested(userId: Types.ObjectId | string, eventId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const idx = user.interestedEvents.indexOf(eventId as Types.ObjectId);
    user.interestedEvents.splice(idx, 1);
    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.findOne({_id: userId});
    for (const c of user.communities)
      await CommunityCollection.deleteUserFromCommunity(c, userId);
    for (const e of user.attendingEvents) 
      await EventCollection.deleteUserFromAttending(e, userId);
    for (const e of user.interestedEvents)
      await EventCollection.deleteUserFromInterested(e, userId);
    await LikeCollection.deleteOne(userId);
    await ControversialCollection.deleteOne(userId);

    const deleted = await UserModel.deleteOne({_id: userId});
    return deleted !== null;
  }
}

export default UserCollection;
