import EventsRepository from '../repositories/events-repository.js';
import rateEventRepo from '../repositories/events-repository.js';
export default class EventsService {
    getAllAsync = async () => {
        const repo = new EventsRepository();
        const EventsArray = await repo.getAllAsync();
        return EventsArray;
    }
     searchEvents = async (filters) => {
        const repo = new EventsRepository();
        const EventsArray = await repo.searchEvents(filters);
        return EventsArray;
    };
    getById = async (id) => {
        const repo = new EventsRepository();
        const Evento = await repo.getById(id)
        return Evento;
    }
    listParticipantes= async (eventId, filters) => {
        const repo = new EventsRepository();
        const EventsArray = await repo.listParticipantes(eventId, filters);
        return EventsArray;
    };
     getEventoById = async (id) => {
        const repo = new EventsRepository();
        const EventsArray = await repo.getByIdAsync(id);
        return EventsArray;
    }
    //8
    createEvent = async (eventData) => {
        const repo = new EventsRepository();
        const EventsArray = await repo.createEvent(eventData);
        return EventsArray;
    };
    updateEvent = async (eventData) => {
        const repo = new EventsRepository();
        const EventsArray = await repo.updateEvent(eventData);
        return EventsArray;
    };
    deleteEvent= async (id) => {
        const repo = new EventsRepository();
        await repo.deleteEvent(id);
    };
    enrollAsync(id, userId) {
        const repo = new EventsRepository();
        return repo.enrollAsync(id, userId);
    }

    unenrollAsync(id, userId) {
        return this.repo.unenrollAsync(id, userId);
    }
    rateEvent = async (eventId, userId, rating, observations) => {
        return await rateEventRepo(eventId, userId, rating, observations);
    };
    
}
