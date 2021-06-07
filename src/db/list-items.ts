import _ from 'lodash'
import {ListItem} from 'types'
import {generateUUID} from './utils'

let listItems: ListItem[] = []

async function query(queryObj: Partial<ListItem>): Promise<ListItem[]> {
  return _.filter(listItems, queryObj)
}

async function create(listItemData: {
  bookId: string
  ownerId: string
}): Promise<ListItem> {
  const {bookId, ownerId} = listItemData
  if (!bookId) {
    throw new Error(`New listItems must have a bookId`)
  }
  if (!ownerId) {
    throw new Error(`New listItems must have an ownerId`)
  }

  const newListItem: ListItem = {
    id: generateUUID(),
    rating: -1,
    notes: '',
    finishDate: null,
    startDate: Date.now(),
    ...listItemData,
  }
  listItems = [...listItems, newListItem]
  return newListItem
}

async function readById(id: string): Promise<ListItem> {
  return _.find(listItems, {id})
}

async function update(
  listItemId: string,
  updates: ListItem,
): Promise<ListItem> {
  const listItem = await readById(listItemId)
  if (!listItem) {
    return null
  }
  const updatedListItem = {
    ...listItem,
    ...updates,
  }
  listItems[listItems.indexOf(listItem)] = updatedListItem
  return updatedListItem
}

async function remove(id: string) {
  listItems = listItems.filter((li) => li.id !== id)
}

async function insertMany(manyListItems: ListItem[]) {
  listItems = [...listItems, ...manyListItems]
}

async function drop() {
  listItems = []
}

export {query, create, readById, update, remove, insertMany, drop}

/* eslint require-await:0 */
