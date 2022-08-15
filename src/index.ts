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
import { CommandVariant, isCommandVariant, lookupCV } from './cv'
import {
  isServiceReferenceVariant,
  lookupSRV,
  ServiceReferenceVariant,
} from './srv'
import { addPrefixToObject } from './util'
export { CommandVariant, lookupCV } from './cv'
export { ServiceReferenceVariant, lookupSRV } from './srv'

export interface RequestId {
  originatorId: string
  targetId: string
  counter: number
}

export function isRequestId(o: unknown): o is RequestId {
  const x = o as RequestId
  return (
    x !== null &&
    typeof x === 'object' &&
    'originatorId' in x &&
    'targetId' in x &&
    'counter' in x &&
    typeof x.counter === 'number' &&
    typeof x.targetId === 'string' &&
    typeof x.originatorId === 'string'
  )
}

function parseRequestID(id: string): RequestId {
  if (typeof id === 'string') {
    const parts = id.toLowerCase().split(':')
    if (parts.length === 3) {
      return {
        originatorId: parts[0],
        targetId: parts[1],
        counter: Number(parts[2]),
      }
    }
  }
  throw new Error('bad request id')
}

export interface RequestHeader<CV, SRV> {
  type: 'request'
  commandVariant: CV
  requestId: RequestId
  serviceReference: string
  serviceReferenceVariant: SRV
}

export function isRequestHeader<CV, SRV>(
  o: unknown,
  isCV: (o: unknown) => o is CV,
  isSRV: (o: unknown) => o is SRV
): o is RequestHeader<CV, SRV> {
  const x = o as RequestHeader<CV, SRV>
  return (
    x !== null &&
    typeof x === 'object' &&
    x.type === 'request' &&
    isCV(x.commandVariant) &&
    isRequestId(x.requestId) &&
    typeof x.serviceReference === 'string' &&
    isSRV(x.serviceReferenceVariant)
  )
}

export interface ResponseHeader {
  type: 'response'
  requestId?: RequestId
  responseId?: RequestId
  responseCode: string
  responseDateTime: string
}

export function isResponseHeader(o: unknown): o is ResponseHeader {
  const x = o as ResponseHeader
  return (
    x !== null &&
    typeof x === 'object' &&
    x.type === 'response' &&
    (x.requestId === undefined || isRequestId(x.requestId)) &&
    (x.responseId === undefined || isRequestId(x.responseId)) &&
    typeof x.responseCode === 'string' &&
    typeof x.responseDateTime === 'string'
  )
}

/**
 * General tree structure of strings to hold parsed DUIS.
 */
export interface XMLData {
  [key: string]: string | XMLData | XMLData[]
}

export function isXMLData(o: unknown): o is XMLData {
  const x = o as XMLData
  return (
    x !== null &&
    typeof x === 'object' &&
    !Array.isArray(x) &&
    Object.keys(x).every(
      (k) =>
        typeof x[k] === 'string' ||
        isXMLData(x[k]) ||
        (Array.isArray(x[k]) && (x[k] as XMLData[]).every(isXMLData))
    )
  )
}

export interface SimplifiedDuisRequest<CV, SRV> {
  header: RequestHeader<CV, SRV>
  body: XMLData
}

export interface SimplifiedDuisResponse {
  header: ResponseHeader
  body: XMLData
}

export type SimplifiedDuis<CV, SRV> =
  | SimplifiedDuisRequest<CV, SRV>
  | SimplifiedDuisResponse

export type SimplifiedDuisOutput = SimplifiedDuis<
  CommandVariant,
  ServiceReferenceVariant
>
export type SimplifiedDuisOutputRequest = SimplifiedDuisRequest<
  CommandVariant,
  ServiceReferenceVariant
>
export type SimplifiedDuisOutputResponse = SimplifiedDuisResponse
export type SimplifiedDuisInput = SimplifiedDuis<
  CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  ServiceReferenceVariant | string
>

export function isSimplifiedDuis<CV, SRV>(
  o: unknown,
  isCV: (o: unknown) => o is CV,
  isSRV: (o: unknown) => o is SRV
): o is SimplifiedDuis<CV, SRV> {
  const x = o as SimplifiedDuis<CV, SRV>
  return (
    x !== null &&
    typeof x === 'object' &&
    isXMLData(x.body) &&
    (isRequestHeader(x.header, isCV, isSRV) || isResponseHeader(x.header))
  )
}

export function isSimplifiedDuisRequest<CV, SRV>(
  o: unknown,
  isCV: (o: unknown) => o is CV,
  isSRV: (o: unknown) => o is SRV
): o is SimplifiedDuisRequest<CV, SRV> {
  const x = o as SimplifiedDuis<CV, SRV>
  return (
    x !== null &&
    typeof x === 'object' &&
    isXMLData(x.body) &&
    isRequestHeader(x.header, isCV, isSRV)
  )
}

export function isSimplifiedDuisResponse(
  o: unknown
): o is SimplifiedDuisResponse {
  const x = o as SimplifiedDuisResponse
  return (
    x !== null &&
    typeof x === 'object' &&
    isXMLData(x.body) &&
    isResponseHeader(x.header)
  )
}

export function isSimplifiedDuisOutput(o: unknown): o is SimplifiedDuisOutput {
  return isSimplifiedDuis<CommandVariant, ServiceReferenceVariant>(
    o,
    isCommandVariant,
    isServiceReferenceVariant
  )
}
export function isSimplifiedDuisOutputRequest(
  o: unknown
): o is SimplifiedDuisOutputRequest {
  return isSimplifiedDuisRequest<CommandVariant, ServiceReferenceVariant>(
    o,
    isCommandVariant,
    isServiceReferenceVariant
  )
}
export function isSimplifiedDuisOutputResponse(
  o: unknown
): o is SimplifiedDuisOutputResponse {
  return isSimplifiedDuisResponse(o)
}

export function isSimplifiedDuisInput(o: unknown): o is SimplifiedDuisInput {
  return isSimplifiedDuis<
    CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    ServiceReferenceVariant | string
  >(
    o,
    (o: unknown): o is CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 => {
      return (typeof o === 'number' && o >= 1 && o <= 8) || isCommandVariant(o)
    },
    (o: unknown): o is ServiceReferenceVariant | string => {
      return typeof o === 'string' || isServiceReferenceVariant(o)
    }
  )
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
      ;(x.header as ResponseHeader).responseId = parseRequestID(responseIdText)
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
    const simple = object as SimplifiedDuisInput
    if (
      !simple.header ||
      ['request', 'response'].indexOf(simple.header.type) < 0
    ) {
      throw new Error('bad header')
    }
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
