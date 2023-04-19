'use strict';

/**
 * empty service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::empty.empty');
