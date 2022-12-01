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

import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { lookupCV } from './cv'
import {
  isSimplifiedDuisInput,
  RequestId,
  ResponseHeader,
  SimplifiedDuisInput,
  SimplifiedDuisOutput,
  XMLData,
} from './duis'
import { lookupSRV } from './srv'
import { addPrefixToObject } from './util'
export { CommandVariant, lookupCV, isCommandVariant } from './cv'
export {
  ServiceReferenceVariant,
  lookupSRV,
  isServiceReferenceVariant,
} from './srv'
export {
  RequestId,
  SimplifiedDuisInput,
  SimplifiedDuisInputRequest,
  SimplifiedDuisOutput,
  SimplifiedDuisOutputRequest,
  SimplifiedDuisOutputResponse,
  XMLData,
  isSimplifiedDuisInput,
  isSimplifiedDuisInputRequest,
  isSimplifiedDuisOutput,
  isSimplifiedDuisOutputRequest,
  isSimplifiedDuisOutputResponse,
  isSimplifiedDuisResponseBody_ResponseMessage_X,
  isSimplifiedDuisResponseBody_ResponseMessage,
  isSimplifiedDuisResponseBody_DeviceAlertMessage,
  isSimplifiedDuisResponseBody_DCCAlertMessage,
  isXMLData,
} from './duis'

export function parseRequestID(id: string): RequestId<bigint> {
  if (typeof id === 'string') {
    const parts = id.toLowerCase().split(':')
    if (parts.length === 3) {
      return {
        originatorId: parts[0],
        targetId: parts[1],
        counter: BigInt(parts[2]),
      }
    }
  }
  throw new Error('bad request id')
}

/**
 * Instead of fully parsing the DUIS into a JSON wil all namespaces, etc
 * exposed. Provide a simplified structure.
 */
export function parseDuis(
  mode: 'simplified',
  xmlData: string | Buffer
): SimplifiedDuisOutput

/**
 * Full parse of DUIS, namespaces and all.
 */
export function parseDuis(mode: 'normal', xmlData: string | Buffer): XMLData

export function parseDuis(
  mode: 'normal' | 'simplified',
  xmlData: string | Buffer
): SimplifiedDuisOutput | XMLData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: mode === 'simplified',
    parseAttributeValue: false /* prevent parsing numbers */,
    parseTagValue: false /* prevent parsing numbers */,
    processEntities: true,
  })
  /* required as java can emit this entity in xmldsig */
  parser.addEntity('#13', '\r')
  const object = parser.parse(xmlData)
  if (mode === 'normal') {
    return object
  }
  /* below are unsafe, but function should only be called on a validated duis
  file. */
  if (object && 'Request' in object && 'Header' in object.Request) {
    const header = object.Request.Header
    const requestId = header.RequestID as string
    const serviceReferenceVariant = lookupSRV(header?.ServiceReferenceVariant)
    if (!serviceReferenceVariant) {
      throw new Error(`could not find SRV ${header?.ServiceReferenceVariant}`)
    }
    const x: SimplifiedDuisOutput = {
      header: {
        type: 'request',
        requestId: parseRequestID(requestId),
        commandVariant: lookupCV(
          Number(header?.CommandVariant) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
        ),
        serviceReference: header?.ServiceReference,
        serviceReferenceVariant,
      },
      body: object.Request?.Body,
    }
    return x
  }

  if (object && 'Response' in object && 'Header' in object.Response) {
    const header = object.Response.Header
    const requestIdText = header.RequestID as string | undefined
    const responseIdText = header.ResponseID as string | undefined
    const x: SimplifiedDuisOutput = {
      header: {
        type: 'response',
        responseCode: header?.ResponseCode,
        responseDateTime: header?.ResponseDateTime,
      },
      body: object.Response?.Body,
    }
    if (typeof requestIdText === 'string') {
      x.header.requestId = parseRequestID(requestIdText)
    }
    if (typeof responseIdText === 'string') {
      ;(x.header as ResponseHeader<bigint>).responseId =
        parseRequestID(responseIdText)
    }
    return x
  }

  throw new Error('bad format duis')
}

export function constructDuis(mode: 'normal', object: XMLData): string
export function constructDuis(
  mode: 'simplified',
  object: SimplifiedDuisInput,
  version?: string
): string

/**
 * Use fast-xml-parser to construct a DUIS xml (without signature). Recommended
 * to use "simplified" mode.
 *
 * @param mode is either "normal" or "simplifed"
 * @param object when "simplified" should be a SimplifiedDuisInput, otherwise it
 * is a fast-xml-parser input
 * @param version when "simplified" is an optional duis version that is written
 * into xml
 * @returns
 */
export function constructDuis(
  mode: 'normal' | 'simplified',
  object: XMLData | SimplifiedDuisInput,
  version?: string
): string {
  if (mode === 'simplified') {
    if (!isSimplifiedDuisInput(object)) {
      throw new Error('input is not simplifed duis')
    }
    const simple = object
    if (simple.header.type === 'request') {
      object = {
        '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
        'sr:Request': {
          '@_xmlns:sr': 'http://www.dccinterface.co.uk/ServiceUserGateway',
          '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@_schemaVersion': version ?? '5.1',
          'sr:Header': {
            'sr:RequestID': `${simple.header.requestId.originatorId}:${simple.header.requestId.targetId}:${simple.header.requestId.counter}`,
            'sr:CommandVariant':
              typeof simple.header.commandVariant === 'number'
                ? String(simple.header.commandVariant)
                : String(simple.header.commandVariant.number),
            'sr:ServiceReference': simple.header.serviceReference,
            'sr:ServiceReferenceVariant':
              typeof simple.header.serviceReferenceVariant === 'string'
                ? simple.header.serviceReferenceVariant
                : simple.header.serviceReferenceVariant[
                    'Service Reference Variant'
                  ],
          },
          'sr:Body': addPrefixToObject('sr:', simple.body) as XMLData,
        },
      }
    } else {
      object = {
        '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
        'sr:Response': {
          '@_xmlns:sr': 'http://www.dccinterface.co.uk/ServiceUserGateway',
          '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@_schemaVersion': version ?? '5.1',
          'sr:Header': {
            'sr:ResponseCode': simple.header.responseCode,
            'sr:ResponseDateTime': simple.header.responseDateTime,
          },
          'sr:Body': addPrefixToObject('sr:', simple.body) as XMLData,
        },
      }
      if (simple.header.requestId) {
        ;((object['sr:Response'] as XMLData)['sr:Header'] as XMLData)[
          'sr:RequestID'
        ] = `${simple.header.requestId.originatorId}:${simple.header.requestId.targetId}:${simple.header.requestId.counter}`
      }
      if (simple.header.responseId) {
        ;((object['sr:Response'] as XMLData)['sr:Header'] as XMLData)[
          'sr:ResponseID'
        ] = `${simple.header.responseId.originatorId}:${simple.header.responseId.targetId}:${simple.header.responseId.counter}`
      }
    }
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: true,
  })

  return builder.build(object)
}
