import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export const EmployeeRoles = ['Sales', 'CustomerSupport', 'Kitchen', 'Delivery', 'Manager'] as const
export type EmployeeRole = (typeof EmployeeRoles)[number]

export interface IEmployee {
  _id?: ObjectId
  employee_id: string
  birth_date?: Date | null
  gender?: string | null
  phone?: string | null
  role: EmployeeRole
  account_id: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

class EmployeeModel {
  get collection() {
    return databaseService.db.collection<IEmployee>('employees')
  }
}

const Employee = new EmployeeModel()
export default Employee
