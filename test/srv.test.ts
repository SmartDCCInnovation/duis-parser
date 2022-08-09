/*
 * Created on Tue Aug 09 2022
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

import * as srv from '../src/srv'

describe('lookupServiceRequestVariant', () => {
  test('empty-srv', () => {
    expect(srv.lookupSRV('')).toBeUndefined()
  })

  test('invalid-srv', () => {
    expect(srv.lookupSRV('1.2.3.4.5')).toBeUndefined()
  })

  test('nominal', () => {
    expect(srv.lookupSRV('3.1')).toStrictEqual({
      'Service Request Name': 'Display Message',
      'Service Reference': '3.1',
      'Service Reference Variant': '3.1',
      Critical: 'No',
      'On Demand': 'Yes',
      'Future Dated Response Pattern': 'DSP',
      'DCC Scheduled': 'No',
      'Non-Device Request': 'No',
      'Eligible User Roles': ['IS', 'GS'],
    })
  })

  test('correct-type', () => {
    expect(srv.isServiceReferenceVariant(srv.lookupSRV('3.1'))).toBeTruthy()
  })
})
