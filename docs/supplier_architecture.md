# LoomAI Supplier Module Architecture

## 1. Domain Overview
The Supplier Domain empowers textile manufacturers and distributors to manage their digital catalog, track precise inventory, process incoming B2B orders, and view aggregated business analytics.

## 2. Strict Role-Based Authorization
Every endpoint under `/v1/supplier/*` is strictly guarded by the `authenticate` and `authorizeRoles('Supplier')` middlewares. 

**Resource Ownership Checks** are enforced across all services. 
- A Supplier cannot update a `Product` they do not own.
- A Supplier cannot view or modify an `Order` where `order.supplierId !== req.user.id`.
- If an unauthorized request is made, a `ForbiddenError` (403) is thrown by the Service layer.

## 3. Product & Inventory Architecture
- **Products**: Supports deep metadata created in Sprint 6.2 (certifications, materials, compositions). Soft deletes are preferred (`productStatus: 'archived'`).
- **Inventory**: The `InventoryService` currently supports boolean `inStock` toggles and Bulk Operations. Future sprints will implement numeric stock deduction based on Checkout transactions.

## 4. Order State Machine
Orders flow through a validated state machine enforced by `SupplierOrderService`:
`Pending` -> `Accepted` / `Rejected` -> `Preparing` -> `Ready for Dispatch` -> `In Transit` -> `Completed`.

## 5. AI & LangGraph Readiness
We have purposefully designed the backend to be entirely accessible to programmatic AI agents:
- **Supplier Copilot Agent**: Could invoke `SupplierProductService.createProduct` by parsing a PDF catalog.
- **Business Advisor Agent**: Could invoke `DashboardService.getDashboardSummary` to analyze MongoDB aggregations, noticing low active product counts or high pending order ratios, and autonomously suggesting business improvements to the Supplier.
