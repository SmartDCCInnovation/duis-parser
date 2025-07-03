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
import * as srv from '../src/srv'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

describe('parser SRV 1.1.1/nominal', () => {
  ;[true, false].forEach((b) => {
    test(b ? 'from-buffer' : 'from-string', async () => {
      const buffer = await readFile(
        resolve(
          __dirname,
          'resources',
          'ECS01a_1.1.1_IMMEDIATE_BLOCK_SUCCESS_REQUEST_DUIS.XML',
        ),
      )
      const result = parser.parseDuis(
        'normal',
        b ? buffer : buffer.toString('utf-8'),
      )
      expect(result).toHaveProperty('sr:Request')
      const request = result['sr:Request']
      expect(request).toHaveProperty(
        '@_xmlns:sr',
        'http://www.dccinterface.co.uk/ServiceUserGateway',
      )
      expect(request).toHaveProperty('sr:Header')
      expect(request).toHaveProperty('sr:Body')
      const header = (request as parser.XMLData)['sr:Header']
      expect(header).toHaveProperty(
        'sr:RequestID',
        '90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A0:1007',
      )
      expect(header).toHaveProperty('sr:ServiceReferenceVariant', '1.1.1')
    })
  })
})

describe('parser SRV 4.1.1/normal', () => {
  ;[true, false].forEach((b) => {
    test(b ? 'from-buffer' : 'from-string', async () => {
      const buffer = await readFile(
        resolve(
          __dirname,
          'resources',
          'GCS13a_4.1.1_SUCCESS_RELIABLE_GSME_REQUEST_DUIS.XML',
        ),
      )
      const result = parser.parseDuis(
        'normal',
        b ? buffer : buffer.toString('utf-8'),
      )
      expect(result).toHaveProperty('sr:Request')
      const request = result['sr:Request']
      expect(request).toHaveProperty(
        '@_xmlns:sr',
        'http://www.dccinterface.co.uk/ServiceUserGateway',
      )
      expect(request).toHaveProperty('sr:Header')
      expect(request).toHaveProperty('sr:Body')
      const header = (request as parser.XMLData)['sr:Header']
      expect(header).toHaveProperty(
        'sr:RequestID',
        '90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A3:1000',
      )
      expect(header).toHaveProperty('sr:ServiceReferenceVariant', '4.1.1')
      const body = (request as parser.XMLData)['sr:Body']
      expect(body).toHaveProperty('sr:ReadInstantaneousImportRegisters', '')
    })
  })
})

describe('parser SRV 4.1.1/simplified', () => {
  ;[true, false].forEach((b) => {
    test(b ? 'from-buffer' : 'from-string', async () => {
      const buffer = await readFile(
        resolve(
          __dirname,
          'resources',
          'GCS13a_4.1.1_SUCCESS_RELIABLE_GSME_REQUEST_DUIS.XML',
        ),
      )
      const result = parser.parseDuis(
        'simplified',
        b ? buffer : buffer.toString('utf-8'),
      )
      expect(result).toMatchObject({
        header: {
          commandVariant: cv.lookupCV(1),
          requestId: {
            originatorId: '90-b3-d5-1f-30-01-00-00',
            targetId: '00-db-12-34-56-78-90-a3',
            counter: BigInt(1000),
          },
          serviceReference: '4.1',
          serviceReferenceVariant: srv.lookupSRV(
            '4.1.1',
          ) as srv.ServiceReferenceVariant,
        },
        body: {
          ReadInstantaneousImportRegisters: '',
        },
      })
    })
  })

  test('lower-case', async () => {
    const buffer = await readFile(
      resolve(
        __dirname,
        'resources',
        'GCS13a_4.1.1_SUCCESS_RELIABLE_GSME_REQUEST_DUIS.XML',
      ),
    )
    const raw = parser.parseDuis('normal', buffer) as any
    const result = parser.parseDuis('simplified', buffer)
    expect(
      raw['sr:Request']?.['sr:Header']?.['sr:RequestID'] as string,
    ).toContain('90-B3-D5-1F-30-01-00-00')
    expect(result.header.requestId?.originatorId).toBe(
      '90-b3-d5-1f-30-01-00-00',
    )
  })
})

describe('parser response', () => {
  test('acknowledgement-error/normal', async () => {
    const buffer = await readFile(
      resolve(__dirname, 'resources', 'acknowledgement-error.xml'),
    )
    const result = parser.parseDuis('normal', buffer)
    expect(result).toMatchObject({
      'sr:Response': {
        'sr:Header': {
          'sr:RequestID':
            '90-B3-D5-1F-30-01-00-00:88-73-84-57-00-2F-96-6C:1658482675800',
          'sr:ResponseCode': 'E65',
        },
        'sr:Body': {
          'sr:ResponseMessage': {
            'sr:ServiceReferenceVariant': '11.2',
          },
        },
      },
    })
  })

  test('acknowledgement-error/simplified', async () => {
    const buffer = await readFile(
      resolve(__dirname, 'resources', 'acknowledgement-error.xml'),
    )
    const result = parser.parseDuis('simplified', buffer)
    expect(result).toMatchObject({
      header: {
        type: 'response',
        requestId: {
          originatorId: '90-b3-d5-1f-30-01-00-00',
          targetId: '88-73-84-57-00-2f-96-6c',
        },
        responseCode: 'E65',
      },
      body: {
        ResponseMessage: {
          ServiceReferenceVariant: '11.2',
        },
      },
    })
  })
})

describe('parseRequestID', () => {
  test('nominal-uppercase', () => {
    expect(
      parser.parseRequestID(
        '90-B3-D5-1F-30-01-00-00:88-73-84-57-00-2F-96-6C:1658482675800',
      ),
    ).toStrictEqual({
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '88-73-84-57-00-2f-96-6c',
      counter: BigInt(1658482675800),
    })
  })

  test('nominal-lowercase', () => {
    expect(
      parser.parseRequestID(
        '90-b3-d5-1f-30-01-00-00:88-73-84-57-00-2f-96-6c:1658482675800',
      ),
    ).toStrictEqual({
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '88-73-84-57-00-2f-96-6c',
      counter: BigInt(1658482675800),
    })
  })

  test('missing-field', () => {
    expect(() =>
      parser.parseRequestID('90-b3-d5-1f-30-01-00-00:1658482675800'),
    ).toThrow('bad request id')
  })

  test('extra-field', () => {
    expect(() =>
      parser.parseRequestID(
        '90-b3-d5-1f-30-01-00-00::88-73-84-57-00-2f-96-6c:1658482675800',
      ),
    ).toThrow('bad request id')
  })
})
