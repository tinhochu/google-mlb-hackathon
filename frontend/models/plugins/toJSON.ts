/* eslint-disable no-param-reassign */
/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
import { Document, Schema } from 'mongoose'

const deleteAtPath = (obj: any, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]]
    return
  }
  deleteAtPath(obj[path[index]], path, index + 1)
}

const toJSON = <T extends Document>(schema: Schema<T>) => {
  schema.set('toJSON', {
    transform: function (doc, ret) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0)
        }
      })

      if (ret._id) {
        ret.id = ret._id.toString()
      }
      delete ret._id
      delete ret.__v

      // Remove password field if it exists
      delete ret.password
    },
  })
}

export default toJSON
