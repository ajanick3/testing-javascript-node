import {Request, Response} from 'express'
import {MockedFunction} from 'ts-jest/dist/utils/testing'

export type Book = {
  id: string
  title: string
  author: string
  coverImageUrl: string
  pageCount: number
  publisher: string
  synopsis: string
}

export type User = {
  id: string
  username: string
  password: string
}

export type ListItem = {
  id: string
  bookId: string
  ownerId: string
  rating: number
  notes: string
  finishDate: Date | number
  startDate: Date | number
}

export interface Req extends Request {
  user?: User
  listItem?: ListItem
  body: {
    bookId?: string
    [key: string]: any
  }
  params: {
    id?: string
  }
  [key: string]: any
}

export interface Res extends Response {
  json: MockedFunction<({}) => any>
  status: MockedFunction<(code: number) => any>
  [key: string]: any
}

export type BuildNext = MockedFunction<any>

export type LoginForm = {
  username: string
  password: string
}