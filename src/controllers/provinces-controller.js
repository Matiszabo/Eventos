import {Router} from 'express';
import ProvincesService from "../services/provinces-service.js"
import ValidacionesHelper from "../helpers/validaciones-helper.js"
const ProvincesRouter =  Router();
const svc = new ProvincesService();
//7
ProvincesRouter.get('/', async (req, res) => {
    try {
        const ProvinceArray = await svc.getAllAsync();
        if (ProvinceArray && ProvinceArray.length > 0) {
            res.status(200).json(ProvinceArray);
        } else {
            res.status(404).json({ message: 'No se encontraron provincias.' });
        }
    } catch (error) {
        console.error('Error fetching provinces:', error);
        res.status(500).json({ message: 'Error interno.' });
    }
});
ProvincesRouter.get('/:id', async (req, res) => {
    try {
        const  id  = req.params.id;
        const provincia = await svc.getByIdAsync(id);
        if (provincia) {
            res.status(200).json(provincia);
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
ProvincesRouter.post('/', async (req, res) => 
{
    let respuesta;
    const entity = req.body;
    if (entity != null) {
      const provinciasArray = await svc.createAsync(entity);
      if (provinciasArray != null || provinciasArray.name.length>3) {
        respuesta = res.status(200).json(provinciasArray);
      } else {
        respuesta = res.status(500).send(`Error interno.`);
      }
    } else {
      respuesta = res.status(400).send(`Error en la solicitud.`);
    }
    return respuesta;
});

ProvincesRouter.post('/', async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;
        if (!name || name.length < 3) {
            return res.status(400).json({ message: 'Name  debe tener al menos 3 caracteres.'});
        }
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Los campos latitude y longitude deben ser números.' });
        }
        const province = await svc.createAsync({ name, latitude, longitude });
        res.status(201).json(province);
    } catch (error) {
        console.error('error');
        res.status(500).json({ message: 'Error' });
    }
});

ProvincesRouter.put("/", async (req, res) => {
    const updatedProvince = req.body;
    try {
        const result = await svc.updateProvince(updatedProvince);
        if (result != null || result.name.length>3) {
            res.status(201).json({ message: "Province actualizada" });
        } else {
            res.status(404).json({ message: "Province no encontrada" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

ProvincesRouter.delete("/:id", async (req, res) => {
    const { id } = req.params.id;
    try {
        const result = await svc.deleteProvince(id);
        const provinceParams=await svc.getByIdAsync(id);
        if (provinceParams.id !=id) {
            res.status(404).json({ message: "El id ingresado es inexistente" });
        } else {
            res.status(200).json({ message: "Province borrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default ProvincesRouter;