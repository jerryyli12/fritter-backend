import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Community = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  members: Array<Types.ObjectId>;
  posts: Array<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CommunitySchema = new Schema<Community>({
  // The author userId
  name: {
    // Use Types.ObjectId outside of the schema
    type: String,
    required: true,
  },
  // The date the freet was created
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  // The content of the freet
  posts: {
    type: [Schema.Types.ObjectId],
    ref: 'Freet',
    required: true
  }
});

const CommunityModel = model<Community>('Community', CommunitySchema);
export default CommunityModel;
