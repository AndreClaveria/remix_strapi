/**
 * article router
 */

import { factories } from "@strapi/strapi";

export default {
  routes: [
    {
      method: "GET",
      path: "/articles/all",
      handler: "article.findAll",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
