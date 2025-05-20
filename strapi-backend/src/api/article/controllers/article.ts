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
  })
);
