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
