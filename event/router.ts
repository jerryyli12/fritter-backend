import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as eventValidator from '../event/middleware';
import * as util from './util';
import { HydratedDocument, Types } from 'mongoose';
import EventCollection from './collection';
import { Event } from './model';

const router = express.Router();

// GET /api/events
// get all events
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const allEvents = await EventCollection.findAll();
    const response = await Promise.all(allEvents.map(m => util.constructEventResponseNoPopulate(m, req.session.userId)));
    res.status(200).json(response);
  }
);

// POST /api/events
// create a new event
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isValidEventName,
    eventValidator.isValidEventLocation,
    eventValidator.isValidEventTime,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const event = await EventCollection.addOne(req.body.name, req.body.location, req.body.time, userId);
    res.status(201).json({
      message: 'Event created.',
      event: await util.constructEventResponse(event, userId)
    });
  }
);

// GET /api/events/view/:eventId?
// get an event
router.get(
  '/view/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists,
  ],
  async (req: Request, res: Response) => {
    const event = await EventCollection.findOne(req.params.eventId);
    const response = await util.constructEventResponse(event, req.session.userId);
    res.status(200).json(response);
  }
);

// PUT /api/events/view/:eventId?
// edit an event
router.put(
  '/view/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists,
    eventValidator.isEventCreator,
    eventValidator.isValidEventLocation,
    eventValidator.isValidEventTime
  ],
  async (req: Request, res: Response) => {
    const event = await EventCollection.updateOne(req.params.eventId, req.body.location, req.body.time);
    res.status(200).json({
      message: 'Your event was updated successfully.',
      event: await util.constructEventResponse(event, req.session.userId)
    });
  }
);

// DELTE /api/events/view/:eventId?
// delete an event
router.delete(
  '/view/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists,
    eventValidator.isEventCreator
  ],
  async (req: Request, res: Response) => {
    await EventCollection.deleteOne(req.params.eventId);
    res.status(200).json({
      message: 'Your event was deleted successfully.'
    });
  }
);

// GET /api/events/user
// get my attending & interested events
router.get(
  '/user',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const events = await EventCollection.getEventsForUser(userId);
    const attendingResponse = await Promise.all(events[0].map(m => util.constructEventResponseNoPopulate(m as HydratedDocument<Event>, userId)));
    const interestedResponse = await Promise.all(events[1].map(m => util.constructEventResponseNoPopulate(m as HydratedDocument<Event>, userId)));
    res.status(200).json({
      attending: attendingResponse,
      interested: interestedResponse
    });
  }
);

// PUT /api/communities/user/attending/:eventId?
// toggle user's attending status
router.put(
  '/user/attending/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const eventId = req.params.eventId;
    const isAttending = (await EventCollection.getUserEventStatus(eventId, userId)) === 'attending';
    const event = isAttending ? await EventCollection.deleteUserFromAttending(eventId, userId) : await EventCollection.addUserToAttending(eventId, userId);
    res.status(200).json({
      message: 'Toggled successfully.',
      event: await util.constructEventResponse(event, req.session.userId),
    });
  }
);

// PUT /api/communities/user/interested/:eventId?
// toggle user's interested status
router.put(
  '/user/interested/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const eventId = req.params.eventId;
    const isInterested = (await EventCollection.getUserEventStatus(eventId, userId)) === 'interested';
    const event = isInterested ? await EventCollection.deleteUserFromInterested(eventId, userId) : await EventCollection.addUserToInterested(eventId, userId);
    res.status(200).json({
      message: 'Toggled successfully.',
      event: await util.constructEventResponse(event, req.session.userId),
    });
  }
);


export {router as eventRouter};
