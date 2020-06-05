import knex from "../database/connection";
import { Request, Response } from "express";

export default class UfController {
  async index(request: Request, response: Response) {
    const uf = await knex("collection_centers").distinct().select("uf");

    return response.json(uf);
  }
}
