/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async findAll(ctx) {
      try {
        const entries = await strapi.entityService.findMany(
          "api::article.article",
          {
            populate: {
              image: {
                populate: "*",
              },
            },
          }
        );

        return ctx.send(entries);
      } catch (err) {
        return ctx.badRequest("Erreur lors de la récupération des articles", {
          error: err.message,
        });
      }
    },

    async create(ctx) {
      try {
        const { Title, Description, image } = ctx.request.body;

        if (!Title || !Description) {
          return ctx.badRequest("Le titre et la description sont requis");
        }

        const entry = await strapi.entityService.create(
          "api::article.article",
          {
            data: {
              Title,
              Description,
              image,
              publishedAt: new Date(),
            },
            populate: {
              image: {
                populate: "*",
              },
            },
          }
        );

        return ctx.send(entry);
      } catch (err) {
        return ctx.badRequest("Erreur lors de la création de l'article", {
          error: err.message,
        });
      }
    },
  })
);
