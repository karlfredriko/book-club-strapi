'use strict';

/**
 * empty router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::empty.empty');
