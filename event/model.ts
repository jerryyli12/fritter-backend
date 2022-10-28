import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Community} from '../community/model';

export type Event = {
  _id: Types.ObjectId;
  name: string;
  location: string;
  time: Date;
  creator: Types.ObjectId;
  attendingUsers: Array<Types.ObjectId>;
  interestedUsers: Array<Types.ObjectId>;
  community: Types.ObjectId;
};

export type PopulatedEvent = {
  _id: Types.ObjectId;
  name: string;
  location: string;
  time: Date;
  creator: User;
  attendingUsers: Array<User>;
  interestedUsers: Array<User>;
  community: Community;
};

const EventSchema = new Schema<Event>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendingUsers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  interestedUsers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  }
});

const EventModel = model<Event>('Event', EventSchema);
export default EventModel;
