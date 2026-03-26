import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IMenu {
  _id?: ObjectId
  menu_name: string
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

class MenuModel {
  get collection() {
    return databaseService.db.collection<IMenu>('menus')
  }
}

const Menu = new MenuModel()
export default Menu
