import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const DB_USERNAME = process.env.DB_USERNAME || 'thinhnguyen'
const DB_PASSWORD = process.env.DB_PASSWORD || 'thinhnguyen'
const DB_NAME = process.env.DB_NAME || 'pizza'

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ww7jj.mongodb.net/?appName=Cluster0`

async function seedSupport() {
  console.log('Connecting to MongoDB for seeding support data...')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(DB_NAME)
  console.log(`Connected to database: "${DB_NAME}"`)

  // 1. Clear existing support tickets
  const collectionName = 'supports'
  await db.collection(collectionName).deleteMany({})
  console.log(`Cleared existing collection: "${collectionName}"`)

  // 2. Sample data
  const now = new Date()
  const oneHour = 3600 * 1000
  const oneDay = 24 * oneHour

  const supports = [
    {
      _id: new ObjectId(),
      name: 'Khánh Minh',
      email: 'customer@order.com',
      phone: '0901122334',
      category: 'Chất lượng món ăn',
      message: 'Tôi đặt pizza Pepperoni nhưng shipper giao nhầm sang Margherita. Mong nhà hàng kiểm tra và đổi lại giúp tôi.',
      status: 'Pending',
      replies: [],
      createdAt: new Date(now.getTime() - 2 * oneHour),
      updatedAt: new Date(now.getTime() - 2 * oneHour)
    },
    {
      _id: new ObjectId(),
      name: 'Nguyễn Văn Nam',
      email: 'customer2@order.com',
      phone: '0987654321',
      category: 'Chất lượng món ăn',
      message: 'Chất lượng bánh rất ngon, vỏ bánh giòn xốp đúng chuẩn lò nướng củi Ý. Tuy nhiên xốt cà chua hơi chua quá một chút.',
      status: 'Processing',
      replies: [
        {
          sender: 'Admin',
          content: 'Chào anh Nam, cảm ơn đóng góp ý kiến của anh về xốt bánh. Nhà hàng sẽ lưu ý điều chỉnh độ chua cân bằng hơn ạ.',
          timestamp: new Date(now.getTime() - 17 * oneHour).toLocaleString('vi-VN')
        }
      ],
      createdAt: new Date(now.getTime() - 18 * oneHour),
      updatedAt: new Date(now.getTime() - 17 * oneHour)
    },
    {
      _id: new ObjectId(),
      name: 'Trần Thị Thuỳ',
      email: 'customer3@order.com',
      phone: '0912345678',
      category: 'Đặt bàn & Sự kiện',
      message: 'Chào nhà hàng, tôi muốn đặt bàn tiệc sinh nhật cho 15 người vào thứ 7 tuần này lúc 19h00. Nhà hàng có set menu hay chương trình ưu đãi gì không?',
      status: 'Resolved',
      replies: [
        {
          sender: 'Admin',
          content: 'Chào chị Thuỳ, nhà hàng đã liên hệ qua số điện thoại để tư vấn set menu tiệc nhóm và giữ bàn cho chị rồi nhé.',
          timestamp: new Date(now.getTime() - 34 * oneHour).toLocaleString('vi-VN')
        }
      ],
      createdAt: new Date(now.getTime() - 36 * oneHour),
      updatedAt: new Date(now.getTime() - 34 * oneHour)
    },
    {
      _id: new ObjectId(),
      name: 'Lê Hoàng Long',
      email: 'longle@gmail.com',
      phone: '0933445566',
      category: 'Voucher & Ưu đãi',
      message: 'Tính năng tích điểm đổi voucher của tiệm dùng rất hay. Hi vọng trong tương lai tiệm ra mắt thêm nhiều loại pizza nhân nhồi mới.',
      status: 'Resolved',
      replies: [],
      createdAt: new Date(now.getTime() - 48 * oneHour),
      updatedAt: new Date(now.getTime() - 48 * oneHour)
    },
    {
      _id: new ObjectId(),
      name: 'Phạm Minh Trang',
      email: 'trangpham@yahoo.com',
      phone: '0955667788',
      category: 'Giao hàng & Vận chuyển',
      message: 'Hôm qua mình đặt hàng giao về hơi chậm 15 phút, bánh nguội một xíu. Mong lần sau quán giao hàng đúng hẹn hơn.',
      status: 'Pending',
      replies: [],
      createdAt: new Date(now.getTime() - 72 * oneHour),
      updatedAt: new Date(now.getTime() - 72 * oneHour)
    }
  ]

  // 3. Insert supports
  const result = await db.collection(collectionName).insertMany(supports)
  console.log(`Successfully seeded ${result.insertedCount} support tickets into the database!`)

  await client.close()
  console.log('MongoDB connection closed.')
}

seedSupport().catch((err) => {
  console.error('Error during seeding:', err)
  process.exit(1)
})
