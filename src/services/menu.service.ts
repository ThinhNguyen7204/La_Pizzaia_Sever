import { ObjectId } from 'mongodb'
import { de } from 'zod/v4/locales'
import Menu from '~/database/models/menu.models'
import Product from '~/database/models/product.model'
import { CreateMenuBodyType, MenuListResType, MenuResType, UpdateMenuBodyType } from '~/schemaValidations/menu.schema'
import { CreateProductBodyType, ProductListResType, UpdateProductBodyType } from '~/schemaValidations/product.schema'
import { StatusError } from '~/utils/errors'

class MenuService {
  async getMenuList() {
    const menu = await Menu.collection.find().sort({ createdAt: -1 }).toArray()
    const formattedData = menu.map((p) => ({ ...p, _id: p._id.toString() }))
    return {
      data: formattedData,
      message: 'Get menu list successfully'
    } as MenuListResType
  }

  async getDetailMenu(menuId: string) {
    if (!ObjectId.isValid(menuId)) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    const menu = await Menu.collection.findOne({ _id: new ObjectId(menuId) })
    if (!menu) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    return {
      data: { id: menu._id.toString(), ...menu },
      message: 'Get menu detail successfully'
    } as MenuResType
  }

  async createMenu(body: CreateMenuBodyType) {
    const now = new Date()
    const newMenu = {
      ...body,
      description: body.description,
      menu_name: body.menu_name,
      createdAt: now,
      updatedAt: now
    }
    const menu = await Menu.collection.insertOne(newMenu)
    return {
      data: { _id: menu.insertedId.toString(), ...menu },
      message: 'Create menu successfully'
    } as MenuResType
  }

  async updateMenu(menuId: string, body: UpdateMenuBodyType) {
    if (!ObjectId.isValid(menuId)) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    const updatedMenu = await Menu.collection.findOneAndUpdate(
      { _id: new ObjectId(menuId) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!updatedMenu) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    return {
      data: updatedMenu,
      message: 'Update menu successfully'
    } as MenuResType
  }

  async deleteMenu(menuId: string) {
    if (!ObjectId.isValid(menuId)) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    const deletedMenu = await Menu.collection.findOneAndDelete({ _id: new ObjectId(menuId) })
    if (!deletedMenu) throw new StatusError({ message: 'Menu does not exist', status: 404 })
    return {
      data: deletedMenu,
      message: 'Delete menu successfully'
    } as MenuResType
  }
}
const menuService = new MenuService()
export default menuService
