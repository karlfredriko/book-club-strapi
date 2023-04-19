'use strict';

/**
 * empty controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::empty.empty');
