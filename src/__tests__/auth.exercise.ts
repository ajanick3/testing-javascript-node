// Testing Authentication API Routes

import axios, {AxiosResponse} from 'axios'
import {AuthResponse, User} from 'types'
import {resetDb} from '../../test/utils/db-utils'
import {loginForm} from '../../test/utils/generate'
import startServer from '../start'

const baseURL = 'http://localhost:8000/api'
const api = axios.create({baseURL})

let server
beforeAll(async () => {
  server = await startServer({port: 8000})
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

  //
  // 🐨 assert that the result you get back is correct
  // 💰 (again, this should be the same data you get back in the other requests,
  // so you can compare it with that).
})
