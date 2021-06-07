import _ from 'lodash'
import {User} from 'types'
import {generateUUID} from './utils'

let users: User[] = []

async function query(queryObj: Partial<User>): Promise<User[]> {
  return _.filter(users, queryObj)
}

async function readById(id: string): Promise<User> {
  return query({id})[0]
}

async function readByUsername(username: string): Promise<User> {
  return (await query({username}))[0]
}

async function insertMany(manyUsers: User[]) {
  users = [...users, ...manyUsers]
}

async function insert(user: User): Promise<User> {
  const newUser = {id: generateUUID(), ...user}
  users = [...users, newUser]
  return newUser
}

async function drop() {
  users = []
}

export {readById, readByUsername, insertMany, insert, query, drop}

/* eslint require-await:0 */
