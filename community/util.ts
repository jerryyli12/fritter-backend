import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Community} from '../community/model';

type CommunityResponse = {
  _id: string;
  name: string;
  members: Array<string>;
  posts: Array<string>;
};

const constructCommunityResponse = (community: HydratedDocument<Community>): CommunityResponse => {
  const communityCopy: Community = {
    ...community.toObject({
      versionKey: false
    })
  };
  return {
    _id: communityCopy._id.toString(),
    name: communityCopy.name,
    members: communityCopy.members.map(a => a.toString()),
    posts: communityCopy.posts.map(a => a.toString()),
  };
};

export {
  constructCommunityResponse
};