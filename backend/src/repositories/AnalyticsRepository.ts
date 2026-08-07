import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Wishlist } from '../models/Wishlist';
import { Review } from '../models/Review';
import { Buyer } from '../models/Buyer';
import { Supplier } from '../models/Supplier';

export class AnalyticsRepository {

  async getBuyerAnalytics(buyerId: string) {
    const objectId = new mongoose.Types.ObjectId(buyerId);

    // 1. Order Stats
    const orderStats = await Order.aggregate([
      { $match: { buyerId: objectId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          pendingOrders: { $sum: { $cond: [{ $in: ["$status", ["Pending", "Accepted", "Preparing", "Ready for Dispatch", "In Transit"]] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $in: ["$status", ["Cancelled", "Rejected"]] }, 1, 0] } },
          totalSpend: { $sum: "$totalValue" },
        }
      }
    ]);

    // 2. Monthly Spend Chart
    const monthlySpend = await Order.aggregate([
      { $match: { buyerId: objectId, status: { $nin: ['Cancelled', 'Rejected'] } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          spend: { $sum: "$totalValue" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    // Format chart for frontend
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const spendingChart = monthlySpend.map(m => ({
      name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      value: m.spend
    }));

    // 3. Wishlist Count
    const wishlist = await Wishlist.findOne({ buyerId: objectId });
    const wishlistCount = wishlist ? wishlist.products.length : 0;

    const stats = orderStats[0] || {
      totalOrders: 0, completedOrders: 0, pendingOrders: 0, cancelledOrders: 0, totalSpend: 0
    };

    return {
      summary: {
        totalOrders: stats.totalOrders,
        completedOrders: stats.completedOrders,
        pendingOrders: stats.pendingOrders,
        cancelledOrders: stats.cancelledOrders,
        totalSpend: stats.totalSpend,
        averageOrderValue: stats.totalOrders > 0 ? stats.totalSpend / stats.totalOrders : 0,
        wishlistCount
      },
      charts: {
        monthlySpend: spendingChart
      }
    };
  }

  async getSupplierAnalytics(supplierId: string) {
    // 1. Product & Inventory Stats
    const productStats = await Product.aggregate([
      { $match: { supplierId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ["$productStatus", "active"] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ["$inStock", false] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $lt: ["$reservedQuantity", 100] }, 1, 0] } }, // Simple assumption for low stock
          totalInventoryValue: { $sum: { $multiply: ["$pricePerMeter", "$reservedQuantity"] } }
        }
      }
    ]);

    // 2. Order & Revenue Stats
    const orderStats = await Order.aggregate([
      { $match: { supplierId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          pendingOrders: { $sum: { $cond: [{ $in: ["$status", ["Pending", "Accepted", "Preparing", "Ready for Dispatch", "In Transit"]] }, 1, 0] } },
          totalRevenue: { $sum: "$totalValue" }
        }
      }
    ]);

    // 3. Monthly Revenue Chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { supplierId, status: { $nin: ['Cancelled', 'Rejected'] } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalValue" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueChart = monthlyRevenue.map(m => ({
      name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue
    }));

    // 4. Orders By Category (Simplified mapping from orders to categories using $lookup)
    const categoryDistribution = await Order.aggregate([
      { $match: { supplierId } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
      { $unwind: "$product" },
      { $lookup: { from: 'categories', localField: 'product.categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          value: { $sum: "$items.quantity" }
        }
      },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 5. Store Rating
    const reviewStats = await Review.aggregate([
      { $match: { supplierId, isPublished: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const pStats = productStats[0] || { totalProducts: 0, activeProducts: 0, outOfStock: 0, lowStock: 0, totalInventoryValue: 0 };
    const oStats = orderStats[0] || { totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalRevenue: 0 };
    const rStats = reviewStats[0] || { averageRating: 0, totalReviews: 0 };

    return {
      summary: {
        totalProducts: pStats.totalProducts,
        activeProducts: pStats.activeProducts,
        outOfStock: pStats.outOfStock,
        lowStock: pStats.lowStock,
        totalInventoryValue: pStats.totalInventoryValue,
        totalOrders: oStats.totalOrders,
        completedOrders: oStats.completedOrders,
        pendingOrders: oStats.pendingOrders,
        totalRevenue: oStats.totalRevenue,
        averageOrderValue: oStats.totalOrders > 0 ? oStats.totalRevenue / oStats.totalOrders : 0,
        storeRating: rStats.averageRating,
        totalReviews: rStats.totalReviews
      },
      charts: {
        revenueChart,
        categoryDistribution
      }
    };
  }

  async getMarketplaceAnalytics() {
    const topProducts = await Product.find({ productStatus: 'active' })
      .sort({ viewCount: -1, orderCount: -1 })
      .limit(10)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name')
      .lean();

    const topRatedProducts = await Product.find({ productStatus: 'active', rating: { $gt: 4 } })
      .sort({ rating: -1 })
      .limit(10)
      .lean();

    const categoryDistribution = await Product.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: "$category" },
      { $project: { name: "$category.name", value: "$count", _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    return {
      summary: {
        topProductsCount: topProducts.length,
        categoriesTracked: categoryDistribution.length
      },
      lists: {
        topViewedProducts: topProducts,
        topRatedProducts
      },
      charts: {
        categoryDistribution
      }
    };
  }

  async getSummaryAnalytics() {
    const totalBuyers = await Buyer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalValue" } } }]);

    return {
      platform: {
        totalBuyers,
        totalSuppliers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeSellers: totalSuppliers // Simplification
      }
    };
  }
}
