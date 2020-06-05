import knex from "../database/connection";
import { Request, Response } from "express";

export default class CentersController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
      items,
    } = request.body;

    const center = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
    };

    const trx = await knex.transaction();

    const newCenter = await trx("collection_centers").insert(center);

    const centerTypes = items
      .split(",")
      .map((type: string) => Number(type.trim()))
      .map((type: number) => {
        return {
          collection_center_id: newCenter[0],
          recycling_type_id: type,
        };
      });

    await trx("collection_centers_recycling_types").insert(centerTypes);
    await trx.commit();

    return response.json({ ...center, id: newCenter[0], items });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const center = await knex("collection_centers").where("id", id).first();

    if (!center) {
      return response.status(400).json({
        message: "There is no center registered with the supplied ID",
      });
    }

    const serialized = {
      ...center,
      image_url: `http://192.168.0.106:3333/uploads/${center.image}`,
    };

    const types = await knex("recycling_types")
      .join(
        "collection_centers_recycling_types",
        "recycling_types.id",
        "=",
        "collection_centers_recycling_types.recycling_type_id"
      )
      .where("collection_centers_recycling_types.collection_center_id", id)
      .select("recycling_types.title");

    return response.json({ center: serialized, types });
  }

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const centers = await knex("collection_centers")
      .join(
        "collection_centers_recycling_types",
        "collection_centers.id",
        "=",
        "collection_centers_recycling_types.collection_center_id"
      )
      .whereIn(
        "collection_centers_recycling_types.recycling_type_id",
        parsedItems
      )
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("collection_centers.*");

    const serialized = centers.map((center) => {
      return {
        ...center,
        image_url: `http://192.168.0.106:3333/uploads/${center.image}`,
      };
    });

    return response.json(serialized);
  }
}
