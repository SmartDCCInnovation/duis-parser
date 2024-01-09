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

import * as cv from '../src/cv'
import * as index from '../src/index'
import * as srv from '../src/srv'
import * as duis from '../src/duis'
import * as parser from '../src/index'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

describe('typeing judgements', () => {
  describe('CommandVariant', () => {
    test('undefined', () => {
      expect(cv.isCommandVariant(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(cv.isCommandVariant(null)).toBeFalsy()
    })
    test('list', () => {
      expect(cv.isCommandVariant([])).toBeFalsy()
    })
    test('number', () => {
      expect(cv.isCommandVariant(5)).toBeFalsy()
    })
    test('string', () => {
      expect(cv.isCommandVariant('')).toBeFalsy()
    })
    test('empty', () => {
      expect(cv.isCommandVariant({})).toBeFalsy()
    })

    test('nominal', () => {
      ;[1, 2, 3, 4, 5, 6, 7, 8].forEach((i) =>
        expect(
          cv.isCommandVariant(cv.lookupCV(i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)),
        ).toBeTruthy(),
      )
    })

    test('wrong-cv-number', () => {
      expect(
        cv.isCommandVariant({
          number: 2,
          description:
            'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
          input: 'Service Request',
          output: 'Command and Command for Local Delivery',
          webService: 'Send Command Service',
          critical: 'No',
        }),
      ).toBeFalsy()
    })

    test('invalid-cv-number', () => {
      expect(
        cv.isCommandVariant({
          number: 0,
          description:
            'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
          input: 'Service Request',
          output: 'Command and Command for Local Delivery',
          webService: 'Send Command Service',
          critical: 'No',
        }),
      ).toBeFalsy()
    })

    test('invalid-cv-number-type', () => {
      expect(
        cv.isCommandVariant({
          number: '3',
          description:
            'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
          input: 'Service Request',
          output: 'Command and Command for Local Delivery',
          webService: 'Send Command Service',
          critical: 'No',
        }),
      ).toBeFalsy()
    })

    test('missing-key', () => {
      expect(
        cv.isCommandVariant({
          number: 3,
          description:
            'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
          input: 'Service Request',
          output: 'Command and Command for Local Delivery',
          webService: 'Send Command Service',
        }),
      ).toBeFalsy()
    })
  })

  describe('ServiceRequestVariant', () => {
    test('undefined', () => {
      expect(srv.isServiceReferenceVariant(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(srv.isServiceReferenceVariant(null)).toBeFalsy()
    })
    test('list', () => {
      expect(srv.isServiceReferenceVariant([])).toBeFalsy()
    })
    test('number', () => {
      expect(srv.isServiceReferenceVariant(5)).toBeFalsy()
    })
    test('string', () => {
      expect(srv.isServiceReferenceVariant('')).toBeFalsy()
    })
    test('empty', () => {
      expect(srv.isServiceReferenceVariant({})).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeTruthy()
    })

    test('missing-serviceRequestName', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-serviceReference', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-serviceReferenceVariant', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-critical', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-onDemand', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-futureDatedResponsePattern', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-dccScheduled', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'Non-Device Request': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-nonDeviceRequest', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Eligible User Roles': ['IS'],
        }),
      ).toBeFalsy()
    })

    test('missing-eligibleUserRoles', () => {
      expect(
        srv.isServiceReferenceVariant({
          'Service Request Name': 'Update Import Tariff (Secondary Element)',
          'Service Reference': '1.1',
          'Service Reference Variant': '1.1.2',
          Critical: 'Yes',
          'On Demand': 'Yes',
          'Future Dated Response Pattern': 'Device',
          'DCC Scheduled': 'No',
          'Non-Device Request': 'No',
        }),
      ).toBeFalsy()
    })
  })

  describe('RequestId', () => {
    describe('bigint', () => {
      const isBigInt = (o: unknown): o is bigint => typeof o === 'bigint'

      test('undefined', () => {
        expect(duis.isRequestId(undefined, isBigInt)).toBeFalsy()
      })
      test('null', () => {
        expect(duis.isRequestId(null, isBigInt)).toBeFalsy()
      })
      test('list', () => {
        expect(duis.isRequestId([], isBigInt)).toBeFalsy()
      })
      test('number', () => {
        expect(duis.isRequestId(5, isBigInt)).toBeFalsy()
      })
      test('string', () => {
        expect(duis.isRequestId('', isBigInt)).toBeFalsy()
      })
      test('empty', () => {
        expect(duis.isRequestId({}, isBigInt)).toBeFalsy()
      })

      test('nominal-bigint', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            isBigInt,
          ),
        ).toBeTruthy()
      })

      test('nominal-number', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            isBigInt,
          ),
        ).toBeFalsy()
      })

      test('missing-originator', () => {
        expect(
          duis.isRequestId(
            {
              targetId: 'string',
              counter: BigInt(0),
            },
            isBigInt,
          ),
        ).toBeFalsy()
      })
      test('missing-target', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              counter: BigInt(0),
            },
            isBigInt,
          ),
        ).toBeFalsy()
      })
      test('missing-counter', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
            },
            isBigInt,
          ),
        ).toBeFalsy()
      })

      test('wrong-counter-type', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: '0',
            },
            isBigInt,
          ),
        ).toBeFalsy()
      })
    })

    describe('bigint or number', () => {
      const isBigIntOrNumber = (o: unknown): o is number | bigint =>
        typeof o === 'number' || typeof o === 'bigint'

      test('undefined', () => {
        expect(duis.isRequestId(undefined, isBigIntOrNumber)).toBeFalsy()
      })
      test('null', () => {
        expect(duis.isRequestId(null, isBigIntOrNumber)).toBeFalsy()
      })
      test('list', () => {
        expect(duis.isRequestId([], isBigIntOrNumber)).toBeFalsy()
      })
      test('number', () => {
        expect(duis.isRequestId(5, isBigIntOrNumber)).toBeFalsy()
      })
      test('string', () => {
        expect(duis.isRequestId('', isBigIntOrNumber)).toBeFalsy()
      })
      test('empty', () => {
        expect(duis.isRequestId({}, isBigIntOrNumber)).toBeFalsy()
      })

      test('nominal-bigint', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            isBigIntOrNumber,
          ),
        ).toBeTruthy()
      })

      test('nominal-number', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            isBigIntOrNumber,
          ),
        ).toBeTruthy()
      })

      test('missing-originator', () => {
        expect(
          duis.isRequestId(
            {
              targetId: 'string',
              counter: BigInt(0),
            },
            isBigIntOrNumber,
          ),
        ).toBeFalsy()
      })
      test('missing-target', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              counter: BigInt(0),
            },
            isBigIntOrNumber,
          ),
        ).toBeFalsy()
      })
      test('missing-counter', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
            },
            isBigIntOrNumber,
          ),
        ).toBeFalsy()
      })

      test('wrong-counter-type', () => {
        expect(
          duis.isRequestId(
            {
              originatorId: 'string',
              targetId: 'string',
              counter: '0',
            },
            isBigIntOrNumber,
          ),
        ).toBeFalsy()
      })
    })
  })

  describe('RequestHeader', () => {
    const isBigInt = (o: unknown): o is bigint => typeof o === 'bigint'
    test('undefined', () => {
      expect(
        duis.isRequestHeader(
          undefined,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        duis.isRequestHeader(
          null,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        duis.isRequestHeader(
          [],
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        duis.isRequestHeader(
          5,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        duis.isRequestHeader(
          '',
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        duis.isRequestHeader(
          {},
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeTruthy()
    })

    test('wrong-type', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'response',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('missing-type', () => {
      expect(
        duis.isRequestHeader(
          {
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('missing-requestid', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('missing-commandVariant', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'request',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('missing-serviceReference', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })

    test('missing-serviceReferenceVariant', () => {
      expect(
        duis.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
        ),
      ).toBeFalsy()
    })
  })

  describe('ResponseHeader', () => {
    const isBigInt = (o: unknown): o is bigint => typeof o === 'bigint'

    test('undefined', () => {
      expect(duis.isResponseHeader(undefined, isBigInt)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isResponseHeader(null, isBigInt)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isResponseHeader([], isBigInt)).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isResponseHeader(5, isBigInt)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isResponseHeader('', isBigInt)).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isResponseHeader({}, isBigInt)).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeTruthy()
    })

    test('optional-requestId', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeTruthy()
    })

    test('optional-responseId', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeTruthy()
    })

    test('wrong-type', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'request',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeFalsy()
    })

    test('wrong-requestId', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: '0',
            },
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeFalsy()
    })

    test('wrong-responseId', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseId: null,
            responseCode: 'string',
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeFalsy()
    })

    test('missing-responseCode', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseDateTime: 'string',
          },
          isBigInt,
        ),
      ).toBeFalsy()
    })

    test('missing-responseDateTime', () => {
      expect(
        duis.isResponseHeader(
          {
            type: 'response',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
          },
          isBigInt,
        ),
      ).toBeFalsy()
    })
  })

  describe('XMLData', () => {
    test('undefined', () => {
      expect(index.isXMLData(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isXMLData(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isXMLData([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isXMLData(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isXMLData('')).toBeFalsy()
    })

    test('empty-ok', () => {
      expect(index.isXMLData({})).toBeTruthy()
    })

    test('nominal', () => {
      expect(
        index.isXMLData({
          a: 'b',
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeTruthy()
    })

    test('nominal-nested', () => {
      expect(
        index.isXMLData({
          a: {
            b: 'c',
            d: '9999',
            e: {
              '__\nwhat': 'ok',
              huho: {},
            },
          },
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeTruthy()
    })

    test('nominal-list', () => {
      expect(
        index.isXMLData({
          a: {
            b: 'c',
            c: [{ d: '9998' }, { d: '9999' }],
          },
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeTruthy()
    })

    test('nominal-list/flat', () => {
      expect(
        index.isXMLData({
          a: {
            b: 'c',
            c: ['9998', '9999'],
          },
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeTruthy()
    })

    test('wrong-type-attribute', () => {
      expect(
        index.isXMLData({
          a: {
            b: 'c',
            d: 9999,
            e: {
              '__\nwhat': 'ok',
              huho: {},
            },
          },
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeFalsy()
    })

    test('wrong-type-attribute-2', () => {
      expect(
        index.isXMLData({
          a: {
            b: 'c',
            d: '9999',
            e: {
              '__\nwhat': 'ok',
              huho: [1],
            },
          },
          '@@_bcdf': 'kjlkj',
        }),
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuis', () => {
    const isBigInt = (o: unknown): o is bigint => typeof o === 'bigint'

    test('undefined', () => {
      expect(
        duis.isSimplifiedDuis(
          undefined,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        duis.isSimplifiedDuis(
          null,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        duis.isSimplifiedDuis(
          [],
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        duis.isSimplifiedDuis(
          5,
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        duis.isSimplifiedDuis(
          '',
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        duis.isSimplifiedDuis(
          {},
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })

    test('nominal-request', () => {
      expect(
        duis.isSimplifiedDuis(
          {
            header: {
              type: 'request',
              commandVariant: cv.lookupCV(1),
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: BigInt(0),
              },
              serviceReference: 'string',
              serviceReferenceVariant: srv.lookupSRV('1.1.1'),
            },
            body: { a: 'c' },
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeTruthy()
    })

    test('nominal-response', () => {
      expect(
        duis.isSimplifiedDuis(
          {
            header: {
              type: 'response',
              responseCode: 'string',
              responseDateTime: 'string',
            },
            body: {
              ResponseMessage: {
                ServiceReference: '1.2',
                ServiceReferenceVariant: '1.2',
              },
            },
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeTruthy()
    })

    test('empty-header', () => {
      expect(
        duis.isSimplifiedDuis(
          {
            header: {},
            body: { a: 'c' },
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })

    test('missing-header', () => {
      expect(
        duis.isSimplifiedDuis(
          {
            body: { a: 'c' },
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })

    test('missing-body', () => {
      expect(
        duis.isSimplifiedDuis(
          {
            header: {
              type: 'response',
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: BigInt(0),
              },
              responseId: {
                originatorId: 'string',
                targetId: 'string',
                counter: BigInt(0),
              },
              responseCode: 'string',
              responseDateTime: 'string',
            },
          },
          isBigInt,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant,
          duis.isSimplifiedDuisResponseBody,
        ),
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisOutput', () => {
    test('undefined', () => {
      expect(duis.isSimplifiedDuisOutput(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isSimplifiedDuisOutput(null)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isSimplifiedDuisOutput([])).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isSimplifiedDuisOutput(5)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isSimplifiedDuisOutput('')).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isSimplifiedDuisOutput({})).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        duis.isSimplifiedDuisOutput({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('wrong-commandVariant', () => {
      expect(
        duis.isSimplifiedDuisOutput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisOutputRequest', () => {
    test('undefined', () => {
      expect(duis.isSimplifiedDuisOutputRequest(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isSimplifiedDuisOutputRequest(null)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isSimplifiedDuisOutputRequest([])).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isSimplifiedDuisOutputRequest(5)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isSimplifiedDuisOutputRequest('')).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isSimplifiedDuisOutputRequest({})).toBeFalsy()
    })

    test('nominal-success', () => {
      expect(
        duis.isSimplifiedDuisOutputRequest({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('nominal-fail', () => {
      expect(
        duis.isSimplifiedDuisOutputRequest({
          header: {
            type: 'response',
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })

    test('nominal-wrongCounter', () => {
      expect(
        duis.isSimplifiedDuisOutputRequest({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })

    test('CS02aMAC/simplified', async () => {
      const buffer = await readFile(
        resolve(
          __dirname,
          'resources',
          'CS02aMAC_6.24.1_SUCCESS_REQUEST_DUIS.XML',
        ),
      )
      const result = parser.parseDuis('simplified', buffer)
      expect(result).toBeTruthy()

      expect(duis.isSimplifiedDuisOutputRequest(result)).toBeTruthy()
    })
  })

  describe('SimplifiedDuisOutputResponse', () => {
    test('undefined', () => {
      expect(duis.isSimplifiedDuisOutputResponse(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isSimplifiedDuisOutputResponse(null)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isSimplifiedDuisOutputResponse([])).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isSimplifiedDuisOutputResponse(5)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isSimplifiedDuisOutputResponse('')).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isSimplifiedDuisOutputResponse({})).toBeFalsy()
    })

    test('nominal-success', () => {
      expect(
        duis.isSimplifiedDuisOutputResponse({
          header: {
            type: 'response',
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          body: {
            ResponseMessage: {
              ServiceReference: '1.2',
              ServiceReferenceVariant: '1.2',
            },
          },
        }),
      ).toBeTruthy()
    })

    test('nominal-fail', () => {
      expect(
        duis.isSimplifiedDuisOutputResponse({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisInput', () => {
    test('undefined', () => {
      expect(duis.isSimplifiedDuisInput(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isSimplifiedDuisInput(null)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isSimplifiedDuisInput([])).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isSimplifiedDuisInput(5)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isSimplifiedDuisInput('')).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isSimplifiedDuisInput({})).toBeFalsy()
    })

    test('nominal-commandVariant-struct', () => {
      expect(
        duis.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('nominal-commandVariant-number', () => {
      expect(
        duis.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('nominal-serviceReferenceVariant-struct', () => {
      expect(
        duis.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('wrong-commandVariant-type', () => {
      expect(
        duis.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: '1',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })

    test('commandVariant-range', () => {
      ;[
        [0, false],
        [1, true],
        [2, true],
        [3, true],
        [4, true],
        [5, true],
        [6, true],
        [7, true],
        [8, true],
        [9, false],
      ].forEach((l) => {
        expect(
          duis.isSimplifiedDuisInput({
            header: {
              type: 'request',
              commandVariant: l[0],
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: BigInt(0),
              },
              serviceReference: 'string',
              serviceReferenceVariant: 'string',
            },
            body: { a: 'c' },
          }),
        ).toBe(l[1])
      })
    })
  })

  describe('SimplifiedDuisInputRequest', () => {
    test('undefined', () => {
      expect(duis.isSimplifiedDuisInputRequest(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(duis.isSimplifiedDuisInputRequest(null)).toBeFalsy()
    })
    test('list', () => {
      expect(duis.isSimplifiedDuisInputRequest([])).toBeFalsy()
    })
    test('number', () => {
      expect(duis.isSimplifiedDuisInputRequest(5)).toBeFalsy()
    })
    test('string', () => {
      expect(duis.isSimplifiedDuisInputRequest('')).toBeFalsy()
    })
    test('empty', () => {
      expect(duis.isSimplifiedDuisInputRequest({})).toBeFalsy()
    })

    test('nominal-commandVariant-struct', () => {
      expect(
        duis.isSimplifiedDuisInputRequest({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('nominal-commandVariant-number', () => {
      expect(
        duis.isSimplifiedDuisInputRequest({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('nominal-serviceReferenceVariant-struct', () => {
      expect(
        duis.isSimplifiedDuisInputRequest({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })

    test('wrong-commandVariant-type', () => {
      expect(
        duis.isSimplifiedDuisInputRequest({
          header: {
            type: 'request',
            commandVariant: '1',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: BigInt(0),
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeFalsy()
    })

    test('commandVariant-range', () => {
      ;[
        [0, false],
        [1, true],
        [2, true],
        [3, true],
        [4, true],
        [5, true],
        [6, true],
        [7, true],
        [8, true],
        [9, false],
      ].forEach((l) => {
        expect(
          duis.isSimplifiedDuisInputRequest({
            header: {
              type: 'request',
              commandVariant: l[0],
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: BigInt(0),
              },
              serviceReference: 'string',
              serviceReferenceVariant: 'string',
            },
            body: { a: 'c' },
          }),
        ).toBe(l[1])
      })
    })

    test('nominal-requestNumber', () => {
      expect(
        duis.isSimplifiedDuisInputRequest({
          header: {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        }),
      ).toBeTruthy()
    })
  })
})
