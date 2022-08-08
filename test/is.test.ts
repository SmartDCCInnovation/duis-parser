import { lookup } from 'dns'
import * as cv from '../src/cv'
import * as index from '../src/index'

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
      expect(index.isRequestHeader(undefined, cv.isCommandVariant)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isRequestHeader(null, cv.isCommandVariant)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isRequestHeader([], cv.isCommandVariant)).toBeFalsy()
    })
    test('number', () => {
      expect(index.isRequestHeader(5, cv.isCommandVariant)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isRequestHeader('', cv.isCommandVariant)).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isRequestHeader({}, cv.isCommandVariant)).toBeFalsy()
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
          },
          cv.isCommandVariant
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
          cv.isCommandVariant
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
      expect(index.isSimplifiedDuis(undefined, cv.isCommandVariant)).toBeFalsy()
    })
    test('null', () => {
      expect(index.isSimplifiedDuis(null, cv.isCommandVariant)).toBeFalsy()
    })
    test('list', () => {
      expect(index.isSimplifiedDuis([], cv.isCommandVariant)).toBeFalsy()
    })
    test('number', () => {
      expect(index.isSimplifiedDuis(5, cv.isCommandVariant)).toBeFalsy()
    })
    test('string', () => {
      expect(index.isSimplifiedDuis('', cv.isCommandVariant)).toBeFalsy()
    })
    test('empty', () => {
      expect(index.isSimplifiedDuis({}, cv.isCommandVariant)).toBeFalsy()
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
              serviceReferenceVariant: 'string',
            },
            body: { a: 'c' },
          },
          cv.isCommandVariant
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
          cv.isCommandVariant
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
          cv.isCommandVariant
        )
      ).toBeFalsy()
    })

    test('missing-header', () => {
      expect(
        index.isSimplifiedDuis(
          {
            body: { a: 'c' },
          },
          cv.isCommandVariant
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
          cv.isCommandVariant
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
            serviceReferenceVariant: 'string',
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
