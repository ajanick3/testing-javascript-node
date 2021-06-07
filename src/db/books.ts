import _ from 'lodash'
import {Book} from 'types'

let books: Book[] = []

async function query(queryObj: Partial<Book>): Promise<Book[]> {
  return _.filter(books, queryObj)
}

async function readById(id: string): Promise<Book> {
  return _.find(books, {id})
}

async function readManyById(ids: string[]): Promise<Book[]> {
  return _.filter(books, (b) => ids.includes(b.id))
}

async function insertMany(manyBooks: Book[]) {
  books = [...books, ...manyBooks]
}

async function insert(book: Book) {
  books = [...books, book]
}

async function drop() {
  books = []
}

export {readById, readManyById, insertMany, query, insert, drop}

/* eslint require-await:0 */
