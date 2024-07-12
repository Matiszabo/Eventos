import {Router} from 'express';
import express from "express";
import LocationsService from "../services/location-service.js"
import { authenticateToken } from '../middlewares/auth-middleware.js';
const LocationsRouter =  Router();
const svc = new LocationsService();
//11
LocationsRouter.get('/', async (req, res) => {
    try {
        const locations = await svc.getAllLocations();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
LocationsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const locations = await svc.getLocationById(id);
        if (locations) {
            res.status(200).json(locations);
        } else {
            res.status(404).json({ message: "El id enviado no existe" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
    LocationsRouter.get('/:id/event-location', async (req, res) => {
        const { id } = req.params;
        try {
            const eventLocations = await svc.getEventLocation(id);
            if (eventLocations) {
                res.status(200).json(eventLocations);
            } 
            // falta devolver 401 si el usuario no esta autenticado
            else {
                res.status(404).json({ message: "El id enviado no existe" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
});
export default LocationsRouter;