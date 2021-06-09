// Testing Authentication API Routes

import axios, {AxiosResponse} from 'axios'
import {AuthResponse} from 'types'
import {handleRequestFailure, resolve} from 'utils/async'
import {resetDb} from '../../test/utils/db-utils'
import {buildUser, loginForm} from '../../test/utils/generate'
import * as usersDB from '../db/users'
import startServer from '../start'

const baseURL = `http://localhost:${process.env.PORT}/api`
const api = axios.create({baseURL})

api.interceptors.response.use(function onSuccess(response) {
  return response
}, handleRequestFailure)

let server
beforeAll(async () => {
  server = await startServer({port: Number(process.env.PORT)})
})
afterAll(() => server.close())
beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = loginForm()

  // register
  const registerResponse: AxiosResponse<AuthResponse> = await api.post(
    'auth/register',
    {
      username,
      password,
    },
  )
  expect(registerResponse.data.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  // login
  const loginResponse: AxiosResponse<AuthResponse> = await api.post(
    'auth/login',
    {
      username,
      password,
    },
  )
  expect(loginResponse.data.user).toEqual(registerResponse.data.user)

  // authenticated request
  const meResponse: AxiosResponse<AuthResponse> = await api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${loginResponse.data.user.token}`,
    },
  })
  expect(meResponse.data.user).toEqual(loginResponse.data.user)
})

test('username should be unique', async () => {
  const {username, password} = loginForm()

  await usersDB.insert(buildUser({username}))

  // register again with same username
  const error = await api
    .post('auth/register', {
      username,
      password,
    })
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username taken"}]`,
  )
})

test('get "me" and unauthenticated returns error', async () => {
  const error = await api.get('auth/me').catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 401: {"code":"credentials_required","message":"No authorization token was found"}]`,
  )
})
