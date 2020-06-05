import express from "express";
import { celebrate, Joi } from "celebrate";
import multer from "multer";
import multerConfig from "./config/upload";

import CentersController from "./controllers/CentersController";
import TypesController from "./controllers/TypesController";
import UfController from "./controllers/UfController";
import CityController from "./controllers/CityController";

const routes = express.Router();
const upload = multer(multerConfig);

const centersController = new CentersController();
const typesController = new TypesController();
const ufController = new UfController();
const cityController = new CityController();

routes.get("/", (request, response) => {
  return response.json({ "Ping?": "Pong" });
});

routes.get("/types", typesController.index);

routes.get("/centers", centersController.index);
routes.get("/centers/:id", centersController.show);
routes.get("/uf", ufController.index);
routes.get("/uf/:uf", cityController.index);

routes.post(
  "/centers",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().required().max(2),
        city: Joi.string().required(),
        items: Joi.string().required(),
      }),
    },
    { abortEarly: false }
  ),
  centersController.create
);

export default routes;
