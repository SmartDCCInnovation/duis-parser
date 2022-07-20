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

import * as cv from '../src/cv'

describe('lookupCV', () => {
  const testdata: { cv: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; service: string }[] = [
    {
      cv: 1,
      service: 'Send Command Service',
    },
    {
      cv: 2,
      service: 'Non-Device Service',
    },
    {
      cv: 3,
      service: 'Send Command Service',
    },
    {
      cv: 4,
      service: 'Transform Service',
    },
    {
      cv: 5,
      service: 'Send Command Service',
    },
    {
      cv: 6,
      service: 'Non-Device Service',
    },
    {
      cv: 7,
      service: 'Send Command Service',
    },
    {
      cv: 8,
      service: 'Non-Device Service',
    },
  ]

  testdata.forEach((td) => {
    test(`cv = ${td.cv}`, () => {
      expect(cv.lookupCV(td.cv)).toHaveProperty('webService', td.service)
    })
  })

  test('bad cv', () => {
    expect(() => cv.lookupCV(0 as 1)).toThrow('out of range')
  })
})
