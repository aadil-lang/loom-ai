import * as mockProductService from './mock/product.service';
import * as mockOrderService from './mock/order.service';
import * as mockSupplierService from './mock/supplier.service';
import * as mockNotificationService from './mock/notification.service';
import * as mockAnalyticsService from './mock/analytics.service';

import * as apiProductService from './api/product.service';
import * as apiOrderService from './api/order.service';
import * as apiSupplierService from './api/supplier.service';
import * as apiNotificationService from './api/notification.service';
import * as apiAnalyticsService from './api/analytics.service';

// Switch this to false when API is ready, or use process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const USE_MOCK = true;

export const productService = USE_MOCK ? mockProductService : apiProductService;
export const orderService = USE_MOCK ? mockOrderService : apiOrderService;
export const supplierService = USE_MOCK ? mockSupplierService : apiSupplierService;
export const notificationService = USE_MOCK ? mockNotificationService : apiNotificationService;
export const analyticsService = USE_MOCK ? mockAnalyticsService : apiAnalyticsService;
