import faker from 'faker'
import {Book, BuildNext, Req, Res, ListItem, User} from 'types'
import {getUserToken, getSaltAndHash} from '../../src/utils/auth'

// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`
const getUsername = faker.internet.userName
const getId = faker.random.uuid
const getSynopsis = faker.lorem.paragraph
const getNotes = faker.lorem.paragraph

function buildUser({
  password = getPassword(),
  ...overrides
}: Partial<User> = {}): User {
  return {
    id: getId(),
    username: getUsername(),
    ...getSaltAndHash(password),
    ...overrides,
  }
}

function buildBook(overrides: Partial<Book> = {}): Book {
  return {
    id: getId(),
    title: faker.lorem.words(),
    author: faker.name.findName(),
    coverImageUrl: faker.image.imageUrl(),
    pageCount: faker.random.number(400),
    publisher: faker.company.companyName(),
    synopsis: faker.lorem.paragraph(),
    ...overrides,
  }
}

function buildListItem(overrides: Partial<ListItem>): ListItem {
  const {
    bookId = overrides.bookId ?? getId(),
    startDate = faker.date.past(2),
    finishDate = faker.date.between(startDate, new Date()),
    ownerId = overrides.ownerId ?? getId(),
  } = overrides
  return {
    id: getId(),
    bookId,
    ownerId,
    rating: faker.random.number(5),
    notes: faker.random.boolean() ? '' : getNotes(),
    finishDate,
    startDate,
    ...overrides,
  }
}

function token(user: User): User {
  return getUserToken(buildUser(user))
}

function loginForm(overrides) {
  return {
    username: getUsername(),
    password: getPassword(),
    ...overrides,
  }
}

function buildReq({
  user = buildUser(),
  ...overrides
}: Partial<Req> = {}): Partial<Req> {
  const req = {user, body: {}, params: {id: ''}, ...overrides}
  return req
}

function buildRes(overrides: Partial<Req> = {}): Res {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  }
  return res
}

function buildNext(impl?: any): BuildNext {
  return jest.fn(impl).mockName('next')
}

export {
  buildReq,
  buildRes,
  buildNext,
  buildUser,
  buildListItem,
  buildBook,
  token,
  loginForm,
  getPassword as password,
  getUsername as username,
  getId as id,
  getSynopsis as synopsis,
  getNotes as notes,
}
