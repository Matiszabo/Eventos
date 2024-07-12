import EventLocationRepository from '../repositories/location-repository.js';

export default class EventLocationService {
  
  getAllEventLocations = async () => {
    const repo = new EventLocationRepository();
    return await repo.getAllEventLocations();
  }

  getEventLocationById = async (id) => {
    const repo = new EventLocationRepository();
    return await repo.getEventLocationById(id);
  }

  createEventLocation = async (eventLocationData) => {
    const repo = new EventLocationRepository();
    return await repo.createEventLocation(eventLocationData);
  }

  updateEventLocation = async (eventLocationData) => {
    const repo = new EventLocationRepository();
    return await repo.updateEventLocation(eventLocationData);
  }

  deleteEventLocation = async (id) => {
    const repo = new EventLocationRepository();
    return await repo.deleteEventLocation(id);
  }
}
