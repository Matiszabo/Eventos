import LocationsRepository from '../repositories/location-repository.js';
export default class LocationsService {
    getAllAsync = async () => {
        const repo = new LocationsRepository();
        const LocationsArray = await repo.getAllLocations();
        return LocationsArray;
    }
    getLocationById = async (id) => {
        const repo = new LocationsRepository();
        const LocationsArray = await repo.getLocationById(id);
        return LocationsArray;
    }
    getEventLocation = async (id) => {
        const repo = new LocationsRepository();
        const LocationsArray = await repo.getEventLocation(id);
        return LocationsArray;
    }
}