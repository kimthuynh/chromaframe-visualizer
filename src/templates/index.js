import { config as landingConfig } from './landing/config.js'
import { config as ecommerceConfig } from './ecommerce/config.js'
import { config as dashboardConfig } from './dashboard/config.js'
import { config as appthemeConfig } from './apptheme/config.js'

export const TEMPLATES = [landingConfig, ecommerceConfig, dashboardConfig, appthemeConfig]

export function getTemplate(id) {
  return TEMPLATES.find(t => t.id === id) ?? landingConfig
}
