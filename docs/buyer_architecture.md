# LoomAI Buyer Module Architecture

## 1. Domain Overview
The Buyer Domain encompasses the entire B2B procurement lifecycle from a buyer's perspective. It securely orchestrates interactions across Profiles, Addresses, Carts, Wishlists, and Orders.

## 2. Strict Role-Based Authorization
Every endpoint under `/v1/buyer/*` is strictly guarded by the `authenticate` and `authorizeRoles('Buyer')` middlewares. 

Furthermore, **Resource Ownership Checks** are enforced consistently at the Service layer. For example, if Buyer A attempts to cancel an order belonging to Buyer B, the `BuyerOrderService` throws a `ForbiddenError`.

## 3. Cart & Checkout Workflow
The `CartService` is the gatekeeper for procurement intent. 
- When an item is added, it validates **Stock Availability** and **Minimum Order Quantity (MOQ)** against the `ProductRepository`.
- The `CheckoutService` orchestrates the final transition. Because LoomAI is a marketplace, a single Cart might contain items from multiple suppliers. The Checkout flow dynamically groups items by `supplierId` and creates distinct, parallel `Orders` for each supplier, clearing the Cart upon success.

## 4. AI & LangGraph Readiness
We have explicitly designed the Buyer services to be invoked programmatically without an HTTP context.
- A future **Procurement Agent** can directly invoke `CartService.addItem()` and `CheckoutService.processCheckout()` to automatically restock supplies based on inventory rules.
- The `BuyerProfileService` manages newly added fields (`preferredCategories`, `budgetRange`), serving as the context window for **Recommendation Agents**.
