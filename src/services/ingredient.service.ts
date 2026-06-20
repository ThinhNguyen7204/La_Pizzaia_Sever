import { ObjectId } from 'mongodb'
import Ingredient from '~/database/models/ingredient.model'
import {
  CreateIngredientBodyType,
  IngredientListResType,
  IngredientResType,
  UpdateIngredientBodyType
} from '~/schemaValidations/ingredient.schema'
import { StatusError } from '~/utils/errors'

class IngredientService {
  async getIngredientList() {
    const list = await Ingredient.collection.find().sort({ createdAt: -1 }).toArray()
    const formatted = list.map((i) => ({ ...i, _id: i._id.toString() }))
    return {
      data: formatted,
      message: 'Get ingredient list successfully!'
    } as IngredientListResType
  }

  async getIngredientDetail(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    const ingredient = await Ingredient.collection.findOne({ _id: new ObjectId(id) })
    if (!ingredient) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    return {
      data: { ...ingredient, _id: ingredient._id.toString() },
      message: 'Get ingredient detail successfully!'
    } as IngredientResType
  }

  async createIngredient(data: CreateIngredientBodyType) {
    const now = new Date()
    const newIngredient = {
      ...data,
      name: data.name || null,
      quantity: data.quantity || null,
      expiration_date: data.expiration_date ? new Date(data.expiration_date) : null,
      createdAt: now,
      updatedAt: now
    }
    const result = await Ingredient.collection.insertOne(newIngredient)
    return {
      data: { ...newIngredient, _id: result.insertedId.toString() },
      message: 'Create ingredient successfully!'
    } as IngredientResType
  }

  async updateIngredient(id: string, data: UpdateIngredientBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    const updateData: any = { ...data, updatedAt: new Date() }
    if (data.expiration_date) updateData.expiration_date = new Date(data.expiration_date)

    const ingredient = await Ingredient.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!ingredient) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    return {
      data: { ...ingredient, _id: ingredient._id.toString() },
      message: 'Update ingredient successfully!'
    } as IngredientResType
  }

  async deleteIngredient(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    const ingredient = await Ingredient.collection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!ingredient) throw new StatusError({ message: 'Ingredient not found', status: 404 })
    return {
      data: { ...ingredient, _id: ingredient._id.toString() },
      message: 'Delete ingredient successfully!'
    } as IngredientResType
  }
}

const ingredientService = new IngredientService()
export default ingredientService
