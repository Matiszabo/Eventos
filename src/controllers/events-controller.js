import {Router} from 'express';
import express from "express";
import EventsService from "../services/events-service.js"
import ValidacionesHelper from "../helpers/validaciones-helper.js"
import { authenticateToken } from '../middlewares/auth-middleware.js';
const EventsRouter =  Router();
const svc = new EventsService();

//4
EventsRouter.get('/:id', async (req, res) => { 
    try {
        const  id  = req.params.id;
        const evento = await svc.getById(id);
        if (evento) {
            res.status(200).json(evento);
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//2
EventsRouter.get('/', async (req, res) => {
    const { name, category, startDate, endDate, page, pageSize } = req.query;

    try {
        const events = await svc.searchEvents({ name, category, startDate, endDate, page, pageSize });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/*EventsRouter.get('/:id', async (req, res) => {
    const id = (req.params.id);
    const result = await svc.getById(id);
    if (result) {
        res.status(200).send(result);
    }
    else {
        res.status(404).send('Evento no encontrado');
    }
});*/

//5 NO FUNCIONA
EventsRouter.get('/:id/enrollment', async (req, res) => {
    const id = (req.params.id);
    if (id === null) {
        res.status(400).send('El id de evento debe ser un número entero');
        return;
    }
    const firstName = (req.query.first_name);
    const lastName = (req.query.last_name);
    const username = (req.query.username);
    const attended = (req.query.attended);
    const rating = (req.query.rating);
    const result = await svc.listParticipantes(id, firstName, lastName, username, attended, rating);
    if (result) {
        res.status(200).send(result);
    }
    else {
        res.status(404).send('No se encontraron inscripciones que cumplan con los criterios de búsqueda');
    }
});
//8
EventsRouter.post('/', authenticateToken, async (req, res) => {
    const { name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location } = req.body;
    const userId = req.user.id;

    if (!name || !description || name.length < 3 || description.length < 3) {
        return res.status(400).json({ message: 'El nombre o la descripción son inválidos.' });
    }

    if (max_assistance > max_capacity) {
        return res.status(400).json({ message: 'El max_assistance es mayor que el max_capacity.' });
    }

    if (price < 0 || duration_in_minutes < 0) {
        return res.status(400).json({ message: 'El precio o la duración son inválidos.' });
    }

    try {
        const newEvent = await createEvent({ name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, userId });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

EventsRouter.put('/', authenticateToken, async (req, res) => {
    const { name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location } = req.body;
    const userId = req.user.id;
    if (!name || !description || name.length < 3 || description.length < 3) {
        return res.status(400).json({ message: 'El nombre o la descripción son inválidos.' });
    }

    if (max_assistance > max_capacity) {
        return res.status(400).json({ message: 'El max_assistance es mayor que el max_capacity.' });
    }

    if (price < 0 || duration_in_minutes < 0) {
        return res.status(400).json({ message: 'El precio o la duración son inválidos.' });
    }
    if(!userId)// en caso de que no se encuentre autenticado (nose como verificar eso)
    {
        return res.status(401).json({ message: 'El usuario no se encuentra autenticado' });
    }
    try {
        const evento = svc.getById(id);
        if (!evento|| evento.user_id !== userId) { 
            res.status(404).send('El evento no existe o no le pretenece al usuario autenticado');
            return;
        }
        else {
            const newEvent = await svc.updateEvent({ name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location});
            return res.status(200).json(newEvent);
        }
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});
EventsRouter.delete('/:id', authenticateToken, async (req, res) => {
    const id=req.params.id;
    const userId = req.user.id;
    try {
        const evento = svc.getById(id);
        if (!evento|| evento.user_id !== userId) { 
            res.status(404).send('El evento no existe o no le pretenece al usuario autenticado');
            return;
        }
        if(!userId)// en caso de que no se encuentre autenticado (nose como verificar eso)
        {
            return res.status(401).json({ message: 'El usuario no se encuentra autenticado' });
        }
        const hasUsersRegistered = false; // Valida que no haya usuarios registrados a este evento ¿?
        if (hasUsersRegistered) {
            return res.status(400).json({ message: 'Hay usuarios registrados en el evento.' });
        }
        else {
            await svc.deleteEvent(id);
            return res.status(200).json({ message: 'Evento eliminado correctamente.'});
        }
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 

EventsRouter.post('/:id/enrollment', authenticateToken, async (req, res) => {
    const id = req.params.id
    if (id === null) {
        res.status(400).send('El id de evento debe ser un número entero');
        return;
    }
    const Id = svc.getById(id);
    if (!Id) {
        res.status(404).send('Evento no encontrado');
        return;
    }
    const rest = await svc.enrollAsync(id, req.user.id);
    if (rest) {
        res.status(201).send();
    }
    else {
        res.status(400).send('Ya no hay cupos disponibles');
    }
})

EventsRouter.delete('/:id/enrollment', authenticateToken, async (req, res) => {
    const id = req.params.id
    if (id === null) {
        res.status(400).send('El id de evento tiene que ser un número entero');
        return;
    }
    const rest = await svc.unenrollAsync(id, req.user.id);
    if (rest == 200) {
        res.status(200).send();
    }
    else if (rest == 404) {
        res.status(404).send('Inscripción o evento no encontrado');
    }
    else {
        res.status(400).send('El evento ya pasó');
    }
});
 
EventsRouter.patch('/:id/enrollment/:rating', authenticateToken, async (req, res) => {
    const eventId = req.params.id;
    const rating = req.params.rating;
    const userId = req.user.id;
    const { observations } = req.body;
    let respuesta;
    try {
        await rateEvent(eventId, userId, rating, observations);           
        respuesta = res.status(200).json({ message: 'Evento rankeado correctamente.' });
    } catch (error) {
        respuesta = res.status(error.status || 500).json({ message: error.message });
    }
    return respuesta;
});

export default EventsRouter;
