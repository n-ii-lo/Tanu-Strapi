'use strict';

const seed = require('./bootstrap/seed');

module.exports = {
  register(/* { strapi } */) {},
  async bootstrap({ strapi }) {
    await seed({ strapi });
  },
};