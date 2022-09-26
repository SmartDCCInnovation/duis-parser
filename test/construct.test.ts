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

describe('constructDuis/simple', () => {
  describe('request', () => {
    test('nominal-lookup', () => {
      const x: parser.SimplifiedDuisInput = {
        header: {
          type: 'request',
          commandVariant: cv.lookupCV(1),
          requestId: {
            originatorId: '90-B3-D5-1F-30-01-00-00',
            targetId: '00-DB-12-34-56-78-90-A3',
            counter: BigInt(9001),
          },
          serviceReference: '4.1',
          serviceReferenceVariant: srv.lookupSRV(
            '4.1.1'
          ) as srv.ServiceReferenceVariant,
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
          type: 'request',
          commandVariant: 1,
          requestId: {
            originatorId: '90-B3-D5-1F-30-01-00-00',
            targetId: '00-DB-12-34-56-78-90-A3',
            counter: BigInt(9001),
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
          type: 'request',
          commandVariant: cv.lookupCV(1),
          requestId: {
            originatorId: '90-B3-D5-1F-30-01-00-00'.toLowerCase(),
            targetId: '00-DB-12-34-56-78-90-A3'.toLowerCase(),
            counter: BigInt(9001),
          },
          serviceReference: '4.1',
          serviceReferenceVariant: srv.lookupSRV(
            '4.1.1'
          ) as srv.ServiceReferenceVariant,
        },
        body: {
          ReadInstantaneousImportRegisters: '',
        },
      }
      expect(
        parser.parseDuis('simplified', parser.constructDuis('simplified', x))
      ).toStrictEqual(x)
    })

    test('nominal-attributes', () => {
      const x: parser.SimplifiedDuisInput = {
        header: {
          type: 'request',
          commandVariant: 1,
          requestId: {
            originatorId: '90-B3-D5-1F-30-01-00-00',
            targetId: '00-DB-12-34-56-78-90-A3',
            counter: BigInt(9001),
          },
          serviceReference: '4.1',
          serviceReferenceVariant: '4.1.1',
        },
        body: {
          '#text': '1',
          '@_index': '3',
        },
      }
      expect(parser.constructDuis('simplified', x)).toBe(
        '<?xml version="1.0" encoding="UTF-8"?><sr:Request xmlns:sr="http://www.dccinterface.co.uk/ServiceUserGateway" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="5.1"><sr:Header><sr:RequestID>90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A3:9001</sr:RequestID><sr:CommandVariant>1</sr:CommandVariant><sr:ServiceReference>4.1</sr:ServiceReference><sr:ServiceReferenceVariant>4.1.1</sr:ServiceReferenceVariant></sr:Header><sr:Body index="3">1</sr:Body></sr:Request>'
      )
    })
  })

  describe('response', () => {
    test('nominal', () => {
      const x: parser.SimplifiedDuisInput = {
        header: {
          type: 'response',
          requestId: {
            originatorId: '90-B3-D5-1F-30-01-00-00',
            targetId: '00-DB-12-34-56-78-90-A3',
            counter: BigInt(9001),
          },
          responseCode: 'E65',
          responseDateTime: '2022-07-22T09:37:56.134Z',
        },
        body: {
          ResponseMessage: {
            ServiceReference: '11.2',
            ServiceReferenceVariant: '11.2',
          },
        },
      }
      /* below string passes xsd validation (ignoring missing xmldsig) */
      expect(parser.constructDuis('simplified', x)).toBe(
        '<?xml version="1.0" encoding="UTF-8"?><sr:Response xmlns:sr="http://www.dccinterface.co.uk/ServiceUserGateway" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="5.1"><sr:Header><sr:ResponseCode>E65</sr:ResponseCode><sr:ResponseDateTime>2022-07-22T09:37:56.134Z</sr:ResponseDateTime><sr:RequestID>90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A3:9001</sr:RequestID></sr:Header><sr:Body><sr:ResponseMessage><sr:ServiceReference>11.2</sr:ServiceReference><sr:ServiceReferenceVariant>11.2</sr:ServiceReferenceVariant></sr:ResponseMessage></sr:Body></sr:Response>'
      )
    })

    test('identity', () => {
      const x: parser.SimplifiedDuisInput = {
        header: {
          type: 'response',
          requestId: {
            originatorId: '90-b3-d5-1f-30-01-00-00',
            targetId: '00-db-12-34-56-78-90-a3',
            counter: BigInt(9001),
          },
          responseCode: 'E65',
          responseDateTime: '2022-07-22T09:37:56.134Z',
        },
        body: {
          ResponseMessage: {
            ServiceReference: '11.2',
            ServiceReferenceVariant: '11.2',
          },
        },
      }
      expect(
        parser.parseDuis('simplified', parser.constructDuis('simplified', x))
      ).toStrictEqual(x)
    })

    test('identity-v2', () => {
      const x: parser.SimplifiedDuisInput = {
        header: {
          type: 'response',
          responseId: {
            originatorId: '90-b3-d5-1f-30-01-00-00',
            targetId: '00-db-12-34-56-78-90-a3',
            counter: BigInt(9001),
          },
          responseCode: 'E65',
          responseDateTime: '2022-07-22T09:37:56.134Z',
        },
        body: {
          ResponseMessage: {
            ServiceReference: '11.2',
            ServiceReferenceVariant: '11.2',
          },
        },
      }
      expect(
        parser.parseDuis('simplified', parser.constructDuis('simplified', x))
      ).toStrictEqual(x)
    })
  })
})
