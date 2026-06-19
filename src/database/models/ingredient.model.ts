import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IIngredient {
  _id?: ObjectId
  name?: string | null
  quantity?: number | null
  expiration_date?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

class IngredientModel {
  get collection() {
    return databaseService.db.collection<IIngredient>('ingredients')
  }
}

const Ingredient = new IngredientModel()
export default Ingredient
