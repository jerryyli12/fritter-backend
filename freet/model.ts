import { Community } from 'community/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  community?: Types.ObjectId;
  likers: Array<Types.ObjectId>;
  conters: Array<Types.ObjectId>;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  community?: Community;
  likers: Array<User>;
  conters: Array<User>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  community: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Community'
  },
  likers: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  conters: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
