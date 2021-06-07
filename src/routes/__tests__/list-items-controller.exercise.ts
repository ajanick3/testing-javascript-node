import {
  buildUser,
  buildBook,
  buildListItem,
  buildReq,
  buildRes,
} from 'utils/generate'
import * as booksDB from '../../db/books'
import * as listItemsController from '../list-items-controller'
import {mocked} from 'ts-jest/utils'

jest.mock('../../db/books')

const mockedBooksDB = mocked(booksDB)

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
