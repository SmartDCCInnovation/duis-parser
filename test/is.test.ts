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
          cv.isCommandVariant(cv.lookupCV(i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8))
        ).toBeTruthy()
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
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
        })
      ).toBeFalsy()
    })
  })

  describe('RequestId', () => {
    test('undefined', () => {
      expect(index.isRequestId(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isRequestId(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isRequestId([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isRequestId(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isRequestId('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isRequestId({})).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isRequestId({
          originatorId: 'string',
          targetId: 'string',
          counter: 0,
        })
      ).toBeTruthy()
    })

    test('missing-originator', () => {
      expect(
        index.isRequestId({
          targetId: 'string',
          counter: 0,
        })
      ).toBeFalsy()
    })
    test('missing-target', () => {
      expect(
        index.isRequestId({
          originatorId: 'string',
          counter: 0,
        })
      ).toBeFalsy()
    })
    test('missing-counter', () => {
      expect(
        index.isRequestId({
          originatorId: 'string',
          targetId: 'string',
        })
      ).toBeFalsy()
    })

    test('wrong-counter-type', () => {
      expect(
        index.isRequestId({
          originatorId: 'string',
          targetId: 'string',
          counter: '0',
        })
      ).toBeFalsy()
    })
  })

  describe('RequestHeader', () => {
    test('undefined', () => {
      expect(
        index.isRequestHeader(
          undefined,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isRequestHeader(
          null,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isRequestHeader(
          [],
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isRequestHeader(
          5,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isRequestHeader(
          '',
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isRequestHeader(
          {},
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isRequestHeader(
          {
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
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeTruthy()
    })

    test('wrong-type', () => {
      expect(
        index.isRequestHeader(
          {
            type: 'response',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-type', () => {
      expect(
        index.isRequestHeader(
          {
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-requestid', () => {
      expect(
        index.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-commandVariant', () => {
      expect(
        index.isRequestHeader(
          {
            type: 'request',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-serviceReference', () => {
      expect(
        index.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-serviceReferenceVariant', () => {
      expect(
        index.isRequestHeader(
          {
            type: 'request',
            commandVariant: cv.lookupCV(1),
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
  })

  describe('ResponseHeader', () => {
    test('undefined', () => {
      expect(index.isResponseHeader(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isResponseHeader(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isResponseHeader([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isResponseHeader(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isResponseHeader('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isResponseHeader({})).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeTruthy()
    })

    test('optional-requestId', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeTruthy()
    })

    test('optional-responseId', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeTruthy()
    })

    test('wrong-type', () => {
      expect(
        index.isResponseHeader({
          type: 'request',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeFalsy()
    })

    test('wrong-requestId', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: '0',
          },
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeFalsy()
    })

    test('wrong-responseId', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseId: null,
          responseCode: 'string',
          responseDateTime: 'string',
        })
      ).toBeFalsy()
    })

    test('missing-responseCode', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseDateTime: 'string',
        })
      ).toBeFalsy()
    })

    test('missing-responseDateTime', () => {
      expect(
        index.isResponseHeader({
          type: 'response',
          requestId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseId: {
            originatorId: 'string',
            targetId: 'string',
            counter: 0,
          },
          responseCode: 'string',
        })
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
        })
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
        })
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
        })
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
        })
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
        })
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuis', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuis(
          undefined,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuis(
          null,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuis(
          [],
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuis(
          5,
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuis(
          '',
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuis(
          {},
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('nominal-request', () => {
      expect(
        index.isSimplifiedDuis(
          {
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
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeTruthy()
    })

    test('nominal-response', () => {
      expect(
        index.isSimplifiedDuis(
          {
            header: {
              type: 'response',
              responseCode: 'string',
              responseDateTime: 'string',
            },
            body: { a: 'c' },
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeTruthy()
    })

    test('empty-header', () => {
      expect(
        index.isSimplifiedDuis(
          {
            header: {},
            body: { a: 'c' },
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-header', () => {
      expect(
        index.isSimplifiedDuis(
          {
            body: { a: 'c' },
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })

    test('missing-body', () => {
      expect(
        index.isSimplifiedDuis(
          {
            header: {
              type: 'response',
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: 0,
              },
              responseId: {
                originatorId: 'string',
                targetId: 'string',
                counter: 0,
              },
              responseCode: 'string',
              responseDateTime: 'string',
            },
          },
          cv.isCommandVariant,
          srv.isServiceReferenceVariant
        )
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisOutput', () => {
    test('undefined', () => {
      expect(index.isSimplifiedDuisOutput(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isSimplifiedDuisOutput(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isSimplifiedDuisOutput([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isSimplifiedDuisOutput(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isSimplifiedDuisOutput('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isSimplifiedDuisOutput({})).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisOutput({
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
        })
      ).toBeTruthy()
    })

    test('wrong-commandVariant', () => {
      expect(
        index.isSimplifiedDuisOutput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        })
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisOutputRequest', () => {
    test('undefined', () => {
      expect(index.isSimplifiedDuisOutputRequest(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isSimplifiedDuisOutputRequest(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isSimplifiedDuisOutputRequest([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isSimplifiedDuisOutputRequest(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isSimplifiedDuisOutputRequest('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isSimplifiedDuisOutputRequest({})).toBeFalsy()
    })

    test('nominal-success', () => {
      expect(
        index.isSimplifiedDuisOutputRequest({
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
        })
      ).toBeTruthy()
    })

    test('nominal-fail', () => {
      expect(
        index.isSimplifiedDuisOutputRequest({
          header: {
            type: 'response',
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          body: { a: 'c' },
        })
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisOutputResponse', () => {
    test('undefined', () => {
      expect(index.isSimplifiedDuisOutputResponse(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isSimplifiedDuisOutputResponse(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isSimplifiedDuisOutputResponse([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isSimplifiedDuisOutputResponse(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isSimplifiedDuisOutputResponse('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isSimplifiedDuisOutputResponse({})).toBeFalsy()
    })

    test('nominal-success', () => {
      expect(
        index.isSimplifiedDuisOutputResponse({
          header: {
            type: 'response',
            responseId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            responseCode: 'string',
            responseDateTime: 'string',
          },
          body: { a: 'c' },
        })
      ).toBeTruthy()
    })

    test('nominal-fail', () => {
      expect(
        index.isSimplifiedDuisOutputResponse({
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
        })
      ).toBeFalsy()
    })
  })

  describe('SimplifiedDuisInput', () => {
    test('undefined', () => {
      expect(index.isSimplifiedDuisInput(undefined)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isSimplifiedDuisInput(null)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isSimplifiedDuisInput([])).toBeFalsy()
    })
    test('number', () => {
      expect(index.isSimplifiedDuisInput(5)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isSimplifiedDuisInput('')).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isSimplifiedDuisInput({})).toBeFalsy()
    })

    test('nominal-commandVariant-struct', () => {
      expect(
        index.isSimplifiedDuisInput({
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
        })
      ).toBeTruthy()
    })

    test('nominal-commandVariant-number', () => {
      expect(
        index.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        })
      ).toBeTruthy()
    })

    test('nominal-serviceReferenceVariant-struct', () => {
      expect(
        index.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: 1,
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: srv.lookupSRV('1.1.1'),
          },
          body: { a: 'c' },
        })
      ).toBeTruthy()
    })

    test('wrong-commandVariant-type', () => {
      expect(
        index.isSimplifiedDuisInput({
          header: {
            type: 'request',
            commandVariant: '1',
            requestId: {
              originatorId: 'string',
              targetId: 'string',
              counter: 0,
            },
            serviceReference: 'string',
            serviceReferenceVariant: 'string',
          },
          body: { a: 'c' },
        })
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
          index.isSimplifiedDuisInput({
            header: {
              type: 'request',
              commandVariant: l[0],
              requestId: {
                originatorId: 'string',
                targetId: 'string',
                counter: 0,
              },
              serviceReference: 'string',
              serviceReferenceVariant: 'string',
            },
            body: { a: 'c' },
          })
        ).toBe(l[1])
      })
    })
  })
})
