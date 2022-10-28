import { Community } from '../community/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Event } from '../event/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  communities: Array<Types.ObjectId>;
  attendingEvents: Array<Types.ObjectId>;
  interestedEvents: Array<Types.ObjectId>;
};

export type PopulatedUser = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  communities: Array<Community>;
  attendingEvents: Array<Event>;
  interestedEvents: Array<Event>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  communities: {
    type: [Schema.Types.ObjectId],
    ref: 'Community',
    required: true
  },
  attendingEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    required: true
  },
  interestedEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
