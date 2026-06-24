import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const DB_USERNAME = process.env.DB_USERNAME || 'thinhnguyen'
const DB_PASSWORD = process.env.DB_PASSWORD || 'thinhnguyen'
const DB_NAME = process.env.DB_NAME || 'pizza'

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ww7jj.mongodb.net/?appName=Cluster0`

async function seed() {
  console.log('Connecting to MongoDB...')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(DB_NAME)
  console.log(`Connected to database: "${DB_NAME}"`)

  // 1. Clear existing collections
  const collections = ['accounts', 'customers', 'menus', 'products', 'ingredients', 'suppliers', 'vouchers', 'loyaltyprograms', 'orders']
  for (const name of collections) {
    await db.collection(name).deleteMany({})
    console.log(`Cleared collection: "${name}"`)
  }

  // 2. Seed Accounts
  console.log('Seeding accounts...')
  const hashedPassword = bcrypt.hashSync('123456', 10)
  const now = new Date()

  const adminAccount = {
    _id: new ObjectId(),
    username: 'Administrator',
    email: 'admin@order.com',
    password: hashedPassword,
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  const staffAccount1 = {
    _id: new ObjectId(),
    username: 'Staff Nguyen',
    email: 'staff1@order.com',
    password: hashedPassword,
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  const staffAccount2 = {
    _id: new ObjectId(),
    username: 'Staff Tran',
    email: 'staff2@order.com',
    password: hashedPassword,
    role: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  // 3 Customer Accounts
  const customerAccount1 = {
    _id: new ObjectId(),
    username: 'Khánh Minh',
    email: 'customer@order.com',
    password: hashedPassword,
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  const customerAccount2 = {
    _id: new ObjectId(),
    username: 'Nguyễn Văn Nam',
    email: 'customer2@order.com',
    password: hashedPassword,
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  const customerAccount3 = {
    _id: new ObjectId(),
    username: 'Trần Thị Thuỳ',
    email: 'customer3@order.com',
    password: hashedPassword,
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    createdAt: now,
    updatedAt: now
  }

  await db.collection('accounts').insertMany([
    adminAccount,
    staffAccount1,
    staffAccount2,
    customerAccount1,
    customerAccount2,
    customerAccount3
  ])

  // 3. Seed Customers
  console.log('Seeding customers...')
  const customer1 = {
    _id: new ObjectId(),
    customer_id: 'CUST01',
    account_id: customerAccount1._id,
    loyalty_points: 350,
    createdAt: now,
    updatedAt: now
  }

  const customer2 = {
    _id: new ObjectId(),
    customer_id: 'CUST02',
    account_id: customerAccount2._id,
    loyalty_points: 120,
    createdAt: now,
    updatedAt: now
  }

  const customer3 = {
    _id: new ObjectId(),
    customer_id: 'CUST03',
    account_id: customerAccount3._id,
    loyalty_points: 240,
    createdAt: now,
    updatedAt: now
  }

  await db.collection('customers').insertMany([customer1, customer2, customer3])

  // 4. Seed Menus (Categories)
  console.log('Seeding menus...')
  const menuPizza = { _id: new ObjectId(), menu_name: 'pizza', description: 'Artisanal Wood-fired Pizzas', createdAt: now, updatedAt: now }
  const menuDrink = { _id: new ObjectId(), menu_name: 'drink', description: 'Fresh and Refreshing Beverages', createdAt: now, updatedAt: now }
  const menuDessert = { _id: new ObjectId(), menu_name: 'dessert', description: 'Sweet Italian Endings', createdAt: now, updatedAt: now }
  const menuSides = { _id: new ObjectId(), menu_name: 'sides', description: 'Delicious Italian Side Dishes', createdAt: now, updatedAt: now }
  await db.collection('menus').insertMany([menuPizza, menuDrink, menuDessert, menuSides])

  // 5. Seed Products
  console.log('Seeding products...')
  const productList = [
    // PIZZAS
    {
      _id: new ObjectId(),
      product_name: 'Truffle Symphony',
      price: 380000,
      description: 'Nước xốt kem truffle đen, phô mai mozzarella tươi, nấm linh chi, phô mai parmigiano-reggiano bào mỏng và lá húng tây.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000',
      size: 'M',
      menu_name: 'pizza',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Pizza Margherita',
      price: 180000,
      description: 'Đơn giản mà tinh tế. Xốt cà chua San Marzano truyền thống, mozzarella tươi kéo sợi, lá húng tây tươi và dầu oliu nguyên chất.',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=1000',
      size: 'M',
      menu_name: 'pizza',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Pizza Pepperoni',
      price: 220000,
      description: 'Một trong những dòng pizza được ưa thích nhất toàn cầu. Xốt cà chua, mozzarella tươi và những lát bò pepperoni nhập khẩu cay nhẹ nướng giòn.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=1000',
      size: 'M',
      menu_name: 'pizza',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Seafood Pesto',
      price: 290000,
      description: 'Đặc trưng ẩm thực vùng duyên hải. Xốt pesto ngò tây béo ngậy, tôm và mực tươi thái khoanh, phô mai mozzarella kéo sợi.',
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=1000',
      size: 'M',
      menu_name: 'pizza',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    // DRINKS
    {
      _id: new ObjectId(),
      product_name: 'Trà Đào Sả',
      price: 45000,
      description: 'Hương vị trà đào hảo hạng kết hợp hoàn hảo cùng sả tươi đập dập thơm nồng, giải nhiệt cực đã.',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'drink',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Coca Cola',
      price: 25000,
      description: 'Coca Cola lon 330ml mát lạnh sảng khoái.',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'drink',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Bia Heineken',
      price: 40000,
      description: 'Bia Heineken lon 330ml mát lạnh sảng khoái nhập khẩu.',
      image: 'https://images.unsplash.com/photo-1600718051056-19c367ffbe27?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'drink',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    // DESSERTS
    {
      _id: new ObjectId(),
      product_name: 'Tiramisu Ý',
      price: 75000,
      description: 'Bánh tráng miệng Tiramisu truyền thống của Ý với phô mai mascarpone béo ngậy xen kẽ lớp bánh thấm đẫm hương vị espresso thơm lừng.',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'dessert',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Panna Cotta',
      price: 65000,
      description: 'Món tráng miệng thạch kem sữa béo ngậy ngọt ngào kết hợp với xốt dâu rừng chua ngọt đậm vị.',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'dessert',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    // SIDES
    {
      _id: new ObjectId(),
      product_name: 'Garlic Bread',
      price: 55000,
      description: 'Bánh mì nướng bơ tỏi thơm lừng, vỏ ngoài giòn rụm bên trong mềm dai ngậy hương vị tỏi.',
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'sides',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Fries (Khoai Tây Chiên)',
      price: 45000,
      description: 'Khoai tây cắt thanh chiên giòn vàng đều, rắc muối cỏ thơm kèm tương cà xốt trứng béo ngậy.',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'sides',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    },
    {
      _id: new ObjectId(),
      product_name: 'Salad Hoàng Đế',
      price: 85000,
      description: 'Salad rau diếp giòn ngọt trộn xốt Caesar truyền thống, kèm vụn bánh mì nướng và phô mai Parmesan bào.',
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600',
      size: 'S',
      menu_name: 'sides',
      status: 'Available',
      createdAt: now,
      updatedAt: now
    }
  ]
  await db.collection('products').insertMany(productList)

  // 6. Seed Ingredients
  console.log('Seeding ingredients...')
  const ingredients = [
    { name: 'Bột mì Ý 00', quantity: 150, expiration_date: new Date('2026-12-31'), createdAt: now, updatedAt: now },
    { name: 'Phô mai Mozzarella', quantity: 80, expiration_date: new Date('2026-08-30'), createdAt: now, updatedAt: now },
    { name: 'Xốt cà chua San Marzano', quantity: 120, expiration_date: new Date('2026-09-15'), createdAt: now, updatedAt: now },
    { name: 'Lạp sườn Pepperoni', quantity: 45, expiration_date: new Date('2026-07-20'), createdAt: now, updatedAt: now },
    { name: 'Dầu nấm truffle đen', quantity: 15, expiration_date: new Date('2027-02-28'), createdAt: now, updatedAt: now },
    { name: 'Húng tây (Basil) tươi', quantity: 20, expiration_date: new Date('2026-07-10'), createdAt: now, updatedAt: now },
    { name: 'Nấm đùi gà tươi', quantity: 50, expiration_date: new Date('2026-07-05'), createdAt: now, updatedAt: now },
    { name: 'Tôm sú tươi', quantity: 30, expiration_date: new Date('2026-06-30'), createdAt: now, updatedAt: now },
    { name: 'Mực ống khoanh', quantity: 40, expiration_date: new Date('2026-07-01'), createdAt: now, updatedAt: now },
    { name: 'Bột tỏi hảo hạng', quantity: 10, expiration_date: new Date('2027-06-30'), createdAt: now, updatedAt: now }
  ]
  await db.collection('ingredients').insertMany(ingredients)

  // 7. Seed Suppliers
  console.log('Seeding suppliers...')
  const suppliers = [
    {
      supplier_name: 'Công ty TNHH Thực phẩm Ý Đại Lợi',
      phone: '02838449911',
      email: 'order@italianfoods.vn',
      supplier_address: '140 Nguyễn Văn Trỗi, Phú Nhuận, TPHCM',
      rating: 5,
      description: 'Nhập khẩu chính ngạch các loại phô mai mozzarella tươi và bột mì Ý chuyên dụng làm pizza.',
      createdAt: now,
      updatedAt: now
    },
    {
      supplier_name: 'Tổng kho Cà chua Vesuvius',
      phone: '02439882233',
      email: 'contact@vesuviustomato.vn',
      supplier_address: 'KCN Quang Minh, Mê Linh, Hà Nội',
      rating: 4,
      description: 'Cung cấp và phân phối cà chua đóng hộp San Marzano DOP độc quyền toàn miền Bắc.',
      createdAt: now,
      updatedAt: now
    },
    {
      supplier_name: 'Tổng kho Thực phẩm Horeca',
      phone: '0901234567',
      email: 'sales@horecafoods.vn',
      supplier_address: 'Quận 7, TPHCM',
      rating: 5,
      description: 'Chuyên cung cấp rau củ quả hữu cơ sạch, tôm mực hải sản tươi ngon đạt tiêu chuẩn VietGAP.',
      createdAt: now,
      updatedAt: now
    },
    {
      supplier_name: 'Công ty Coca-Cola Việt Nam',
      phone: '19001255',
      email: 'order@cocacola.vn',
      supplier_address: 'Thủ Đức, TPHCM',
      rating: 4,
      description: 'Cung cấp trực tiếp các loại đồ uống có ga, nước tinh khiết, nước giải khát lon.',
      createdAt: now,
      updatedAt: now
    }
  ]
  await db.collection('suppliers').insertMany(suppliers)

  // 8. Seed Vouchers
  console.log('Seeding vouchers...')
  const vouchers = [
    {
      code: 'PIZZA50K',
      description: 'Giảm ngay 50.000đ cho hóa đơn từ 200.000đ trở lên.',
      discount_type: 'FixedAmount',
      discount_value: 50000,
      min_order_value: 200000,
      max_discount: 50000,
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-08-31'),
      usage_limit: 500,
      used_count: 12,
      is_active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      code: 'WELCOME10',
      description: 'Giảm 10% tổng hóa đơn cho đơn đầu tiên.',
      discount_type: 'Percentage',
      discount_value: 10,
      min_order_value: 0,
      max_discount: 30000,
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-12-31'),
      usage_limit: 1000,
      used_count: 45,
      is_active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      code: 'PIZZA100K',
      description: 'Giảm ngay 100.000đ cho hoá đơn từ 400.000đ trở lên.',
      discount_type: 'FixedAmount',
      discount_value: 100000,
      min_order_value: 400000,
      max_discount: 100000,
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-09-30'),
      usage_limit: 200,
      used_count: 5,
      is_active: true,
      createdAt: now,
      updatedAt: now
    },
    {
      code: 'FREESHIP',
      description: 'Giảm giá 20.000đ phí giao hàng cho mọi đơn đặt hàng.',
      discount_type: 'FixedAmount',
      discount_value: 20000,
      min_order_value: 100000,
      max_discount: 20000,
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-12-31'),
      usage_limit: 1000,
      used_count: 89,
      is_active: true,
      createdAt: now,
      updatedAt: now
    }
  ]
  await db.collection('vouchers').insertMany(vouchers)

  // 9. Seed Loyalty Programs
  console.log('Seeding loyalty programs...')
  const programs = [
    { name: 'Đổi 50 điểm', description: 'Đổi 50 điểm lấy voucher giảm giá 5% hóa đơn', points_required: 50, discount_type: 'Percentage', discount_value: 5, is_active: true, createdAt: now, updatedAt: now },
    { name: 'Đổi 100 điểm', description: 'Đổi 100 điểm lấy voucher giảm giá 10% hóa đơn', points_required: 100, discount_type: 'Percentage', discount_value: 10, is_active: true, createdAt: now, updatedAt: now },
    { name: 'Đổi 200 điểm', description: 'Đổi 200 điểm lấy voucher giảm giá 100.000đ trực tiếp', points_required: 200, discount_type: 'FixedAmount', discount_value: 100000, is_active: true, createdAt: now, updatedAt: now },
    { name: 'Đổi 300 điểm', description: 'Đổi 300 điểm lấy voucher giảm giá 150.000đ trực tiếp', points_required: 300, discount_type: 'FixedAmount', discount_value: 150000, is_active: true, createdAt: now, updatedAt: now },
    { name: 'Đổi 500 điểm', description: 'Đổi 500 điểm lấy voucher giảm giá 250.000đ trực tiếp', points_required: 500, discount_type: 'FixedAmount', discount_value: 250000, is_active: true, createdAt: now, updatedAt: now }
  ]
  await db.collection('loyaltyprograms').insertMany(programs)

  // 10. Seed Orders (generate mock orders for the last 30 days to build charts)
  console.log('Seeding orders (generating 40 mock orders distributed among 3 customers)...')
  const mockOrders = []
  const customersList = [customer1, customer2, customer3]

  for (let i = 0; i < 40; i++) {
    // Generate dates spreading across the last 30 days
    const orderDate = new Date()
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30))
    // Random status (high percentage of Paid/Delivered to show revenue)
    const randomSeed = Math.random()
    let status = 'Paid'
    if (randomSeed < 0.1) status = 'Cancelled'
    else if (randomSeed < 0.2) status = 'Pending'
    else if (randomSeed < 0.35) status = 'Processing'
    else if (randomSeed < 0.5) status = 'Shipping'
    else if (randomSeed < 0.8) status = 'Delivered'

    // Choose 1 or 2 random products
    const productCount = Math.random() > 0.5 ? 2 : 1
    const orderItems = []
    let orderTotal = 0

    for (let k = 0; k < productCount; k++) {
      const randomProd = productList[Math.floor(Math.random() * productList.length)]
      const quantity = Math.floor(Math.random() * 2) + 1
      orderItems.push({
        product_id: randomProd._id,
        product_name: randomProd.product_name,
        price: randomProd.price,
        quantity: quantity
      })
      orderTotal += randomProd.price * quantity
    }

    const discountAmount = Math.random() > 0.7 ? 30000 : 0
    const finalPrice = Math.max(0, orderTotal - discountAmount)

    // Distribute orders among the 3 customers
    const randomCustomer = customersList[Math.floor(Math.random() * customersList.length)]

    mockOrders.push({
      _id: new ObjectId(),
      customer_id: randomCustomer._id, // User account customer link
      delivery_type: Math.random() > 0.5 ? 'Delivery' : 'Pickup',
      address: '123 Đường Hải Sản, Quận 1, TPHCM',
      items: orderItems,
      orderTotal,
      discountAmount,
      discountLytP: 0,
      finalPrice,
      paid: status === 'Paid' || status === 'Delivered' ? finalPrice : 0,
      payment_code: status === 'Paid' || status === 'Delivered' ? `PAY_${Math.floor(100000 + Math.random() * 900000)}` : null,
      ship_code: status === 'Delivered' || status === 'Shipping' ? `SHIP_${Math.floor(100000 + Math.random() * 900000)}` : null,
      bonus_point: Math.floor(finalPrice / 10000), // 1 point per 10k VND
      status,
      order_date: orderDate,
      createdAt: orderDate,
      updatedAt: orderDate
    })
  }

  await db.collection('orders').insertMany(mockOrders)
  console.log(`Successfully generated ${mockOrders.length} orders.`)

  console.log('Database Seeding Complete!')
  await client.close()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
