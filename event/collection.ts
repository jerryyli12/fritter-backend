import { Types, HydratedDocument } from "mongoose";
import EventModel from "./model";
import CommunityCollection from "../community/collection";
import {Event} from './model';
import UserCollection from "../user/collection";
import { PopulatedUser } from "../user/model";

class EventCollection {

  static async addOne(name: string, location: string, time: Date, creator: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = new EventModel({
      name,
      location,
      time,
      creator,
      attendingUsers: [],
      interestedUsers: [],
      community: await CommunityCollection.addOne(name, creator),
    });

    await event.save();
    return event;
  }

  static async findOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    return EventModel.findOne({_id: eventId});
  }

  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    return EventModel.find();
  }

  static async deleteOne(eventId: Types.ObjectId | string): Promise<boolean> {
    const event = await EventModel.findOne({_id: eventId});
    await CommunityCollection.deleteOne(event.community);
    const delEvent = await EventModel.deleteOne({_id: eventId});
    return delEvent !== null;
  }

  static async updateOne(eventId: Types.ObjectId | string, location: string, time: Date): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    event.time = time;
    event.location = location;
    await event.save();
    return event;
  }

  static async getUserEventStatus(eventId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<string> {
    const event = await EventModel.findOne({_id: eventId});
    const idx1 = event.attendingUsers.indexOf(userId as Types.ObjectId);
    const idx2 = event.interestedUsers.indexOf(userId as Types.ObjectId);
    if (idx1 !== -1)
      return 'attending';
    if (idx2 !== -1)
      return 'interested';
    return 'none';
  }

  static async addUserToAttending(eventId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    event.attendingUsers.push(userId as Types.ObjectId);
    await UserCollection.addUserToAttending(userId, eventId);
    await event.save();
    const idx = event.interestedUsers.indexOf(userId as Types.ObjectId);
    return idx !== -1 ? await EventCollection.deleteUserFromInterested(eventId, userId) : event;
  }

  static async deleteUserFromAttending(eventId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    const idx = event.attendingUsers.indexOf(userId as Types.ObjectId);
    event.attendingUsers.splice(idx, 1);
    await UserCollection.deleteUserFromAttending(userId, eventId);
    await event.save();
    return event;
  }

  static async addUserToInterested(eventId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    event.interestedUsers.push(userId as Types.ObjectId);
    await UserCollection.addUserToInterested(userId, eventId);
    await event.save();
    const idx = event.attendingUsers.indexOf(userId as Types.ObjectId);
    return idx !== -1 ? await EventCollection.deleteUserFromAttending(eventId, userId) : event;
  }

  static async deleteUserFromInterested(eventId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    const idx = event.interestedUsers.indexOf(userId as Types.ObjectId);
    event.interestedUsers.splice(idx, 1);
    await UserCollection.deleteUserFromInterested(userId, eventId);
    await event.save();
    return event;
  }

  static async getEventsForUser(userId: Types.ObjectId | string): Promise<[Array<Event>, Array<Event>]> {
    const user = await UserCollection.findOneByUserId(userId);
    const populatedUser = await user.populate('attendingEvents interestedEvents') as PopulatedUser;
    return [populatedUser.attendingEvents, populatedUser.interestedEvents];
  }

}

export default EventCollection;
