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

import * as parser from '../src/index'
import * as cv from '../src/cv'

describe('constructDuis - simple', () => {
  test('nominal-lookup', () => {
    const x: parser.SimplifiedDuisInput = {
      header: {
        commandVariant: cv.lookupCV(1),
        requestId: {
          originatorId: '90-B3-D5-1F-30-01-00-00',
          targetId: '00-DB-12-34-56-78-90-A3',
          counter: 9001,
        },
        serviceReference: '4.1',
        serviceReferenceVariant: '4.1.1',
      },
      body: {
        ReadInstantaneousImportRegisters: '',
      },
    }
    /* below string passes xsd validation (ignoring missing xmldsig) */
    expect(parser.constructDuis('simplified', x)).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><sr:Request xmlns:sr="http://www.dccinterface.co.uk/ServiceUserGateway" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="5.1"><sr:Header><sr:RequestID>90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A3:9001</sr:RequestID><sr:CommandVariant>1</sr:CommandVariant><sr:ServiceReference>4.1</sr:ServiceReference><sr:ServiceReferenceVariant>4.1.1</sr:ServiceReferenceVariant></sr:Header><sr:Body><sr:ReadInstantaneousImportRegisters></sr:ReadInstantaneousImportRegisters></sr:Body></sr:Request>'
    )
  })

  test('nominal-no-lookup', () => {
    const x: parser.SimplifiedDuisInput = {
      header: {
        commandVariant: 1,
        requestId: {
          originatorId: '90-B3-D5-1F-30-01-00-00',
          targetId: '00-DB-12-34-56-78-90-A3',
          counter: 9001,
        },
        serviceReference: '4.1',
        serviceReferenceVariant: '4.1.1',
      },
      body: {
        ReadInstantaneousImportRegisters: '',
      },
    }
    expect(parser.constructDuis('simplified', x)).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><sr:Request xmlns:sr="http://www.dccinterface.co.uk/ServiceUserGateway" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="5.1"><sr:Header><sr:RequestID>90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A3:9001</sr:RequestID><sr:CommandVariant>1</sr:CommandVariant><sr:ServiceReference>4.1</sr:ServiceReference><sr:ServiceReferenceVariant>4.1.1</sr:ServiceReferenceVariant></sr:Header><sr:Body><sr:ReadInstantaneousImportRegisters></sr:ReadInstantaneousImportRegisters></sr:Body></sr:Request>'
    )
  })

  test('identity', () => {
    const x: parser.SimplifiedDuisInput = {
      header: {
        commandVariant: cv.lookupCV(1),
        requestId: {
          originatorId: '90-B3-D5-1F-30-01-00-00'.toLowerCase(),
          targetId: '00-DB-12-34-56-78-90-A3'.toLowerCase(),
          counter: 9001,
        },
        serviceReference: '4.1',
        serviceReferenceVariant: '4.1.1',
      },
      body: {
        ReadInstantaneousImportRegisters: '',
      },
    }
    expect(
      parser.parseDuis('simplified', parser.constructDuis('simplified', x))
    ).toStrictEqual(x)
  })
})
