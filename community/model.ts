import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type Community = {
  _id: Types.ObjectId;
  name: string;
  members: Array<Types.ObjectId>;
  freets: Array<Types.ObjectId>;
};

export type PopulatedCommunity = {
  _id: Types.ObjectId;
  name: string;
  members: Array<User>;
  freets: Array<Freet>;
};

const CommunitySchema = new Schema<Community>({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  freets: {
    type: [Schema.Types.ObjectId],
    ref: 'Freet',
    required: true
  }
});

const CommunityModel = model<Community>('Community', CommunitySchema);
export default CommunityModel;
