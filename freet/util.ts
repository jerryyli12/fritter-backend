import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import LikeCollection from '../like/collection';
import ControversialCollection from '../controversial/collection';

// Update this if you add a property to the Freet type!
export type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  likes: number;
  iLiked: boolean;
  blur: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = async (freet: HydratedDocument<Freet>, userId: Types.ObjectId | string): Promise<FreetResponse> => {
  const populatedFreet = await freet.populate('authorId') as PopulatedFreet;
  const contSetting = (await ControversialCollection.findOne(userId)).contSetting;
  return {
    _id: populatedFreet._id.toString(),
    author: populatedFreet.authorId.username,
    content: populatedFreet.content,
    dateCreated: formatDate(populatedFreet.dateCreated),
    dateModified: formatDate(populatedFreet.dateModified),
    likes: populatedFreet.likers.length,
    iLiked: await LikeCollection.didUserLikeFreet(userId, populatedFreet._id),
    blur: (await ControversialCollection.didUserControversialFreet(userId, populatedFreet._id) || (populatedFreet.conters.length > 2 && populatedFreet.conters.length > populatedFreet.likers.length && !contSetting)) && !(userId.toString() === populatedFreet.authorId._id.toString()),
  };
};

export {
  constructFreetResponse
};
