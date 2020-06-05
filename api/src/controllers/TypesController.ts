import knex from "../database/connection";
import { Request, Response } from "express";

export default class TypesController {
  async index(request: Request, response: Response) {
    const types = await knex("recycling_types").select("*");

    const serializedTypes = types.map((type) => {
      return {
        id: type.id,
        title: type.title,
        image_url: `http://192.168.0.106:3333/uploads/${type.image}`,
      };
    });

    return response.json(serializedTypes);
  }
}
