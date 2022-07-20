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
import { CommandVariant, lookupCV } from './cv'
import { addPrefixToObject } from './util'
export { CommandVariant, lookupCV } from './cv'

export interface SimplifiedDuis<T> {
  header: {
    commandVariant: T
    requestId: {
      originatorId: string
      targetId: string
      counter: number
    }
    serviceReference: string
    serviceReferenceVariant: string
  }
  body: any
}

export type SimplifiedDuisOutput = SimplifiedDuis<CommandVariant>
export type SimplifiedDuisInput = SimplifiedDuis<CommandVariant | number>

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
export function parseDuis(mode: 'normal', xmlData: string | Buffer): any

export function parseDuis(
  mode: 'normal' | 'simplified',
  xmlData: string | Buffer
): any {
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
  const header = object?.Request?.Header
  const requestId = (header?.RequestID as string).toLowerCase().split(':')
  const x: SimplifiedDuisOutput = {
    header: {
      requestId: {
        originatorId: requestId[0],
        targetId: requestId[1],
        counter: Number(requestId[2]),
      },
      commandVariant: lookupCV(
        Number(header?.CommandVariant) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
      ),
      serviceReference: header?.ServiceReference,
      serviceReferenceVariant: header?.ServiceReferenceVariant,
    },
    body: object?.Request?.Body,
  }
  return x
}

export function constructDuis(
  mode: 'normal',
  object: any,
  version?: string
): string
export function constructDuis(
  mode: 'simplified',
  object: SimplifiedDuisInput,
  version?: string
): string

export function constructDuis(
  mode: 'normal' | 'simplified',
  object: any,
  version?: string
): string {
  if (mode === 'simplified') {
    const simple = object as SimplifiedDuisInput
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
              ? simple.header.commandVariant
              : simple.header.commandVariant.number,
          'sr:ServiceReference': simple.header.serviceReference,
          'sr:ServiceReferenceVariant': simple.header.serviceReferenceVariant,
        },
        'sr:Body': addPrefixToObject('sr:', simple.body),
      },
    }
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: true,
  })

  return builder.build(object)
}
