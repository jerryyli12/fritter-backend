import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type Controversial = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  contedFreets: Array<Types.ObjectId>;
  contSetting: boolean;
};

export type PopulatedControversial = {
  _id: Types.ObjectId;
  user: User;
  contedFreets: Array<Freet>;
  contSetting: boolean;
};

const ControversialSchema = new Schema<Controversial>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contedFreets: {
    type: [Schema.Types.ObjectId],
    ref: 'Freet',
    required: true,
  },
  contSetting: {
    type: Boolean,
    required: true,
  },
});

const ControversialModel = model<Controversial>('Controversial', ControversialSchema);
export default ControversialModel;
