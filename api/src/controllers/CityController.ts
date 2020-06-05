import knex from "../database/connection";
import { Request, Response } from "express";

export default class CitiesController {
  async index(request: Request, response: Response) {
    const { uf } = request.params;
    const cities = await knex("collection_centers").select("city").where({ uf });

    return response.json(cities);
  }
}
