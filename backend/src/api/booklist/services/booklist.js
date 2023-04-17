'use strict';

/**
 * booklist service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::booklist.booklist');
