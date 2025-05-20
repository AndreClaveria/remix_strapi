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
    {
      method: "POST",
      path: "/articles/create",
      handler: "article.create",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
