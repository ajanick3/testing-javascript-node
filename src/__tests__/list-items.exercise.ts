// Testing CRUD API Routes

import axios from 'axios'
import {insertTestUser, resetDb} from '../../test/utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'
import {mocked} from 'ts-jest/utils'
import {AxiosResponseWrapper, ListItem} from 'types'

let baseURL, server

beforeAll(async () => {
  server = await startServer()
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server?.close())

beforeEach(() => resetDb())

jest.mock('../db/books')
const mockedBooksDB = mocked(booksDB)

async function setup() {
  // 💰 this bit isn't as important as the rest of what you'll be learning today
  // so I'm going to give it to you, but don't just skip over it. Try to figure
  // out what's going on here.
  const testUser = await insertTestUser()
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${testUser.token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()

  const book = generate.buildBook()
  await mockedBooksDB.insert(book)

  // CREATE
  const cData: AxiosResponseWrapper<ListItem> = await authAPI.post(
    'list-items',
    {bookId: book.id},
  )
  expect(cData.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
  })

  // 💰 you might find this useful for the future requests:
  const listItemId = cData.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`

  // READ
  const rData: AxiosResponseWrapper<ListItem> = await authAPI.get(listItemIdUrl)
  expect(rData.listItem).toEqual(cData.listItem)

  // UPDATE
  const updates = {notes: generate.notes()}
  const uData: AxiosResponseWrapper<ListItem> = await authAPI.put(
    listItemIdUrl,
    updates,
  )
  expect(uData.listItem).toEqual({...rData.listItem, ...updates})

  // DELETE
  const dData: AxiosResponseWrapper<ListItem> = await authAPI.delete(
    listItemIdUrl,
  )
  expect(dData).toEqual({success: true})
  const error: AxiosResponseWrapper<ListItem> = await authAPI
    .get(listItemIdUrl)
    .catch(resolve)
  expect(error.status).toBe(404)

  // snapshots will always fail. replace id with LIST_ITEM_ID
  const sanitizedMessage = error.data.message.replace(
    listItemId,
    'LIST_ITEM_ID',
  )
  expect(sanitizedMessage).toMatchInlineSnapshot(
    `"No list item was found with the id of LIST_ITEM_ID"`,
  )
})

/* eslint no-unused-vars:0 */
