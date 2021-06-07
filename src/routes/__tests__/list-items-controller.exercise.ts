import {
  buildUser,
  buildBook,
  buildListItem,
  buildReq,
  buildRes,
  buildNext,
} from 'utils/generate'
import {mocked} from 'ts-jest/utils'
import * as booksDB from '../../db/books'
import * as listItemsDB from '../../db/list-items'
import * as listItemsController from '../list-items-controller'

jest.mock('../../db/books')
const mockedBooksDB = mocked(booksDB)
jest.mock('../../db/list-items')
const mockedListItemsDB = mocked(listItemsDB)

beforeEach(() => {
  jest.resetAllMocks()
})

test('getListItem returns the req.listItem', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({bookId: book.id, ownerId: user.id})

  mockedBooksDB.readById.mockResolvedValueOnce(book)

  const req = buildReq({user, listItem})
  const res = buildRes()

  await listItemsController.getListItem(req, res)

  expect(mockedBooksDB.readById).toHaveBeenCalledWith(book.id)
  expect(mockedBooksDB.readById).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({
    listItem: {...listItem, book},
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('createListItem returns 400 error if no bookId', async () => {
  const req = buildReq({body: {bookId: undefined}})
  const res = buildRes()

  await listItemsController.createListItem(req, res)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('setListItem sets listItem on the req', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})
  mockedListItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = buildReq({user, params: {id: listItem.id}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)
  expect(mockedListItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(mockedListItemsDB.readById).toHaveBeenCalledTimes(1)

  expect(next).toHaveBeenCalledWith(/* nothing */)
  expect(next).toHaveBeenCalledTimes(1)

  expect(req.listItem).toBe(listItem)
})

test('setListItem returns a 404 if listItem does not exist', async () => {
  mockedListItemsDB.readById.mockResolvedValueOnce(null)

  const fakeListItemId = 'FAKE_LIST_ITEM_ID'
  const req = buildReq({params: {id: fakeListItemId}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)

  expect(mockedListItemsDB.readById).toHaveBeenCalledWith(fakeListItemId)
  expect(mockedListItemsDB.readById).toHaveBeenCalledTimes(1)

  expect(next).not.toHaveBeenCalled()

  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of FAKE_LIST_ITEM_ID",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('setListItem returns a 403 if listItem does not belong to user', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const listItem = buildListItem({
    id: 'FAKE_LIST_ITEM_ID',
    ownerId: 'OTHER',
  })
  mockedListItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = buildReq({user, params: {id: listItem.id}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res)

  expect(mockedListItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(mockedListItemsDB.readById).toHaveBeenCalledTimes(1)

  expect(next).not.toHaveBeenCalled()

  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User with id FAKE_USER_ID is not authorized to access the list item FAKE_LIST_ITEM_ID",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test("getListItems returns the user's list items", async () => {
  const user = buildUser()
  const books = [buildBook(), buildBook()]
  const userListItems = [
    buildListItem({
      ownerId: user.id,
      bookId: books[0].id,
    }),
    buildListItem({
      ownerId: user.id,
      bookId: books[1].id,
    }),
  ]

  mockedBooksDB.readManyById.mockResolvedValueOnce(books)
  mockedListItemsDB.query.mockResolvedValueOnce(userListItems)

  const req = buildReq({user})
  const res = buildRes()

  await listItemsController.getListItems(req, res)
  expect(mockedBooksDB.readManyById).toHaveBeenCalledWith([
    books[0].id,
    books[1].id,
  ])
  expect(mockedBooksDB.readManyById).toHaveBeenCalledTimes(1)

  expect(mockedListItemsDB.query).toHaveBeenCalledWith({ownerId: user.id})
  expect(mockedListItemsDB.query).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({
    listItems: [
      {...userListItems[0], book: books[0]},
      {...userListItems[1], book: books[1]},
    ],
  })
})
