/*
 * Created on Wed Jul 20 2022
 *
 * Copyright (c) 2022 Smart DCC Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as util from '../src/util'

describe('addPrefixToObject', () => {
  test('undefined', () => {
    expect(util.addPrefixToObject('test', undefined)).toBe(undefined)
  })

  test('list', () => {
    expect(util.addPrefixToObject('test', [1, 2, 3])).toStrictEqual([1, 2, 3])
  })

  test('nominal', () => {
    expect(util.addPrefixToObject('test', { hello: 'world' })).toStrictEqual({
      testhello: 'world',
    })
  })

  test('nested', () => {
    expect(
      util.addPrefixToObject('ns:', { hello: 'world', ok: { red: 'blue' } })
    ).toStrictEqual({
      'ns:hello': 'world',
      'ns:ok': { 'ns:red': 'blue' },
    })
  })

  test('nested-with-list', () => {
    expect(
      util.addPrefixToObject('ns:', { hello: 'world', ok: [{ red: 'blue' }] })
    ).toStrictEqual({
      'ns:hello': 'world',
      'ns:ok': [{ 'ns:red': 'blue' }],
    })
  })

  test('nested-with-list-2', () => {
    expect(
      util.addPrefixToObject('ns:', [{ hello: 'world', ok: [{ red: 'blue' }] }])
    ).toStrictEqual([
      {
        'ns:hello': 'world',
        'ns:ok': [{ 'ns:red': 'blue' }],
      },
    ])
  })

  test('number-keys', () => {
    expect(
      util.addPrefixToObject('test', { hello: 'world', 5: 2 })
    ).toStrictEqual({
      testhello: 'world',
      test5: 2,
    })
  })
})
