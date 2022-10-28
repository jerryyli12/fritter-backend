import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type Like = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  likedFreets: Array<Types.ObjectId>;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  user: User;
  likedFreets: Array<Freet>;
};

const LikeSchema = new Schema<Like>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likedFreets: {
    type: [Schema.Types.ObjectId],
    ref: 'Freet',
    required: true,
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
