import type {HydratedDocument, Types} from 'mongoose';
import type {Community, PopulatedCommunity} from '../community/model';
import { constructUserResponse, UserResponse } from '../user/util';
import { constructCommunityResponseNoPopulate, CommunityResponse } from '../community/util';
import { User } from '../user/model';
import { PopulatedEvent } from './model';
import moment from 'moment';
import {Event} from './model';
import EventCollection from './collection';

type EventResponse = {
  _id: string;
  name: string;
  location: string;
  time: string;
  creator: UserResponse;
  attendingUsers: Array<UserResponse> | number;
  interestedUsers: Array<UserResponse> | number;
  userStatus: string;
  community: CommunityResponse;
};

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructEventResponse = async (event: HydratedDocument<Event>, userId: Types.ObjectId | string): Promise<EventResponse> => {
  const populatedEvent = await event.populate('attendingUsers interestedUsers creator community') as PopulatedEvent;
  return {
    _id: populatedEvent._id.toString(),
    name: populatedEvent.name,
    location: populatedEvent.location,
    time: formatDate(populatedEvent.time),
    creator: constructUserResponse(populatedEvent.creator as HydratedDocument<User>),
    attendingUsers: populatedEvent.attendingUsers.map(m => constructUserResponse(m as HydratedDocument<User>)),
    interestedUsers: populatedEvent.interestedUsers.map(m => constructUserResponse(m as HydratedDocument<User>)),
    userStatus: await EventCollection.getUserEventStatus(populatedEvent._id, userId),
    community: await constructCommunityResponseNoPopulate(populatedEvent.community as HydratedDocument<Community>, userId)
  };
};

const constructEventResponseNoPopulate = async (event: HydratedDocument<Event>, userId: Types.ObjectId | string): Promise<EventResponse> => {
  const populatedEvent = await event.populate('creator community') as PopulatedEvent;
  return {
    _id: populatedEvent._id.toString(),
    name: populatedEvent.name,
    location: populatedEvent.location,
    time: formatDate(populatedEvent.time),
    creator: constructUserResponse(populatedEvent.creator as HydratedDocument<User>),
    attendingUsers: populatedEvent.attendingUsers.length,
    interestedUsers: populatedEvent.interestedUsers.length,
    userStatus: await EventCollection.getUserEventStatus(populatedEvent._id, userId),
    community: await constructCommunityResponseNoPopulate(populatedEvent.community as HydratedDocument<Community>, userId)
  };
};

export {
  constructEventResponse,
  constructEventResponseNoPopulate
};