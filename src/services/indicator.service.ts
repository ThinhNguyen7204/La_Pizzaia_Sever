import { ObjectId } from 'mongodb'
import Order from '~/database/models/order.model'
import Product from '~/database/models/product.model'
import { OrderStatus } from '~/constants/type'
import { DashboardIndicatorResType } from '~/schemaValidations/indicator.schema'

class IndicatorService {
  async getDashboardIndicators(fromDate: Date, toDate: Date): Promise<DashboardIndicatorResType> {
    // 1. Lấy các đơn hàng thành công (Paid hoặc Delivered) trong khoảng thời gian
    const successOrders = await Order.collection.find({
      order_date: {
        $gte: fromDate,
        $lte: toDate
      },
      status: {
        $in: [OrderStatus.Paid, OrderStatus.Delivered]
      }
    }).toArray()

    const revenue = successOrders.reduce((sum, order) => sum + (order.finalPrice || 0), 0)
    
    // Đếm số lượng khách hàng duy nhất đặt đơn thành công
    const uniqueCustomers = new Set<string>()
    successOrders.forEach(order => {
      if (order.customer_id) {
        uniqueCustomers.add(order.customer_id.toString())
      }
    })
    const guestCount = uniqueCustomers.size
    const orderCount = successOrders.length

    // 2. Tính số đơn hàng đang xử lý (Pending, Processing, Shipping)
    const servingOrdersCount = await Order.collection.countDocuments({
      order_date: {
        $gte: fromDate,
        $lte: toDate
      },
      status: {
        $in: [OrderStatus.Pending, OrderStatus.Processing, OrderStatus.Shipping]
      }
    })

    // 3. Tính revenueByDate (doanh thu theo ngày YYYY-MM-DD)
    const revenueByDateMap = new Map<string, number>()
    
    // Điền trước các ngày trong khoảng từ fromDate đến toDate với giá trị 0
    let currentDate = new Date(fromDate)
    while (currentDate <= toDate) {
      const dateStr = currentDate.toISOString().slice(0, 10)
      revenueByDateMap.set(dateStr, 0)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    successOrders.forEach(order => {
      // Dùng order_date, chuyển thành chuỗi YYYY-MM-DD
      const dateStr = order.order_date.toISOString().slice(0, 10)
      const currentRev = revenueByDateMap.get(dateStr) || 0
      revenueByDateMap.set(dateStr, currentRev + (order.finalPrice || 0))
    })

    const revenueByDate = Array.from(revenueByDateMap.entries()).map(([date, rev]) => ({
      date,
      revenue: rev
    })).sort((a, b) => a.date.localeCompare(b.date))

    // 4. Tính các món ăn bán chạy nhất
    const popularProducts = await Order.collection.aggregate([
      {
        $match: {
          order_date: {
            $gte: fromDate,
            $lte: toDate
          },
          status: {
            $in: [OrderStatus.Paid, OrderStatus.Delivered]
          }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product_id',
          successOrders: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $project: {
          _id: '$_id',
          product_name: '$productInfo.product_name',
          price: '$productInfo.price',
          description: '$productInfo.description',
          image: '$productInfo.image',
          size: '$productInfo.size',
          menu_name: '$productInfo.menu_name',
          status: '$productInfo.status',
          successOrders: 1
        }
      },
      {
        $sort: { successOrders: -1 }
      }
    ]).toArray()

    return {
      message: 'Get dashboard indicators successfully',
      data: {
        revenue,
        guestCount,
        orderCount,
        servingTableCount: servingOrdersCount,
        dishIndicator: popularProducts as any[],
        revenueByDate
      }
    }
  }
}

const indicatorService = new IndicatorService()
export default indicatorService
