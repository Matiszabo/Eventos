import express from "express";
import cors from "cors";
import EventsRouter from "./src/controllers/events-controller.js";
import ProvincesRouter from "./src/controllers/provinces-controller.js";
import UsersRouter from "./src/controllers/users-controller.js";
import ECRouter from "./src/controllers/event_categories-controller.js";
import LocationRouter from "./src/controllers/event_locations-controller.js"
const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 
app.use('/api/province', ProvincesRouter);
app.use('/api/user', UsersRouter);
app.use('/api/event', EventsRouter);
app.use('/api/eventCategory', ECRouter);
app.use('/api/location', LocationRouter);


app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`);
   })