/*
 * Created on Thu Aug 18 2022
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

import { CommandVariant, isCommandVariant } from './cv'
import { isServiceReferenceVariant, ServiceReferenceVariant } from './srv'

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

export interface SimplifiedDuisResponse_ResponseMessage_CINMessage {
  CINMessage: {
    GBCSPayload: string
    CustomerIdentificationNumber: string
  }
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPInventory {
  DSPInventory: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPOptIn {
  DSPOptIn: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead {
  DSPSchedulesRead: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage {
  DSPScheduledMessage: {
    GBCSPayload: string
    DSPScheduleID: number
  }
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPScheduleID {
  DSPScheduleID: number
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning {
  DSPUpdateFirmwareWarning: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning {
  DSPUpdatePPMIDFirmwareWarning: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix {
  DSPWANMatrix: XMLData
}

export interface SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage {
  FutureDatedDeviceAlertMessage: {
    FutureDatedAlertCode: string
    GBCSPayload: string
    InstructionNumber: number
    TotalCommandInstructions: number
  }
}

export interface SimplifiedDuisResponse_ResponseMessage_GBCSPayload {
  GBCSPayload: string
}

export interface SimplifiedDuisResponse_ResponseMessage_LocalCommand {
  LocalCommand: {
    GBCSPayload: string
  }
}

export interface SimplifiedDuisResponse_ResponseMessage_PreCommand {
  PreCommand: {
    GBCSVersion: string
    GBCSPayload: string
  }
}

export type SimplifiedDuisResponse_ResponseMessage<T> = {
  ResponseMessage: {
    ServiceReference: string
    ServiceReferenceVariant: string
  } & T
}

export interface SimplifiedDuisResponse_DeviceAlertMessage {
  DeviceAlertMessage: {
    AlertCode: string
    ThrottledAlertSequenceId?: number
    ThrottledAlertCount?: number
    GBCSPayload: string
  }
}

export interface SimplifiedDuisResponse_DCCAlertMessage {
  DCCAlertMessage: {
    DCCAlertCode: string
    ThrottledAlertSequenceId?: number
    ThrottledAlertCount?: number
    DCCAlert: XMLData
  }
}

export type SimplifiedDuisResponse_ResponseMessage_NoBody = Record<
  'ServiceReference' | 'ServiceReferenceVariant',
  string
>

export type SimplifiedDuisResponseBody =
  | SimplifiedDuisResponse_ResponseMessage<
      | SimplifiedDuisResponse_ResponseMessage_CINMessage
      | SimplifiedDuisResponse_ResponseMessage_DSPInventory
      | SimplifiedDuisResponse_ResponseMessage_DSPOptIn
      | SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead
      | SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage
      | SimplifiedDuisResponse_ResponseMessage_DSPScheduleID
      | SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning
      | SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning
      | SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix
      | SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage
      | SimplifiedDuisResponse_ResponseMessage_GBCSPayload
      | SimplifiedDuisResponse_ResponseMessage_LocalCommand
      | SimplifiedDuisResponse_ResponseMessage_PreCommand
      | SimplifiedDuisResponse_ResponseMessage_NoBody
    >
  | SimplifiedDuisResponse_DeviceAlertMessage
  | SimplifiedDuisResponse_DCCAlertMessage

export interface SimplifiedDuisResponse<R> {
  header: ResponseHeader
  body: R
}

export type SimplifiedDuis<CV, SRV, R> =
  | SimplifiedDuisRequest<CV, SRV>
  | SimplifiedDuisResponse<R>

export type SimplifiedDuisOutput = SimplifiedDuis<
  CommandVariant,
  ServiceReferenceVariant,
  SimplifiedDuisResponseBody
>
export type SimplifiedDuisOutputRequest = SimplifiedDuisRequest<
  CommandVariant,
  ServiceReferenceVariant
>
export type SimplifiedDuisOutputResponse =
  SimplifiedDuisResponse<SimplifiedDuisResponseBody>
export type SimplifiedDuisInput = SimplifiedDuis<
  CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  ServiceReferenceVariant | string,
  SimplifiedDuisResponseBody
>

export function isSimplifiedDuisRequest<CV, SRV>(
  o: unknown,
  isCV: (o: unknown) => o is CV,
  isSRV: (o: unknown) => o is SRV
): o is SimplifiedDuisRequest<CV, SRV> {
  const x = o as SimplifiedDuis<CV, SRV, never>
  return (
    x !== null &&
    typeof x === 'object' &&
    isXMLData(x.body) &&
    isRequestHeader(x.header, isCV, isSRV)
  )
}

export function isSimplifiedDuisResponse<R>(
  o: unknown,
  isR: (o: unknown) => o is R
): o is SimplifiedDuisResponse<R> {
  const x = o as SimplifiedDuisResponse<R>
  return (
    x !== null &&
    typeof x === 'object' &&
    isR(x.body) &&
    isResponseHeader(x.header)
  )
}

export function isSimplifiedDuis<CV, SRV, R>(
  o: unknown,
  isCV: (o: unknown) => o is CV,
  isSRV: (o: unknown) => o is SRV,
  isR: (o: unknown) => o is R
): o is SimplifiedDuis<CV, SRV, R> {
  return (
    isSimplifiedDuisRequest<CV, SRV>(o, isCV, isSRV) ||
    isSimplifiedDuisResponse<R>(o, isR)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_CINMessage(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_CINMessage {
  const x = o as SimplifiedDuisResponse_ResponseMessage_CINMessage
  return (
    x !== null &&
    typeof x === 'object' &&
    x.CINMessage !== null &&
    typeof x.CINMessage === 'object' &&
    typeof x.CINMessage.CustomerIdentificationNumber === 'string' &&
    typeof x.CINMessage.GBCSPayload === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPInventory(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPInventory {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPInventory
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPInventory !== null &&
    isXMLData(x.DSPInventory)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPOptIn(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPOptIn {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPOptIn
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPOptIn !== null &&
    isXMLData(x.DSPOptIn)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPSchedulesRead !== null &&
    isXMLData(x.DSPSchedulesRead)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPScheduledMessage !== null &&
    typeof x.DSPScheduledMessage === 'object' &&
    typeof x.DSPScheduledMessage.DSPScheduleID === 'string' &&
    typeof x.DSPScheduledMessage.GBCSPayload === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPScheduleID(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPScheduleID {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPScheduleID
  return (
    x !== null && typeof x === 'object' && typeof x.DSPScheduleID === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPUpdateFirmwareWarning !== null &&
    isXMLData(x.DSPUpdateFirmwareWarning)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning {
  const x =
    o as SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPUpdatePPMIDFirmwareWarning !== null &&
    isXMLData(x.DSPUpdatePPMIDFirmwareWarning)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_DSPWANMatrix(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix {
  const x = o as SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DSPWANMatrix !== null &&
    isXMLData(x.DSPWANMatrix)
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage {
  const x =
    o as SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage
  return (
    x !== null &&
    typeof x === 'object' &&
    x.FutureDatedDeviceAlertMessage !== null &&
    typeof x.FutureDatedDeviceAlertMessage === 'object' &&
    typeof x.FutureDatedDeviceAlertMessage.FutureDatedAlertCode === 'string' &&
    typeof x.FutureDatedDeviceAlertMessage.GBCSPayload === 'string' &&
    typeof x.FutureDatedDeviceAlertMessage.InstructionNumber === 'string' &&
    typeof x.FutureDatedDeviceAlertMessage.TotalCommandInstructions === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_GBCSPayload(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_GBCSPayload {
  const x = o as SimplifiedDuisResponse_ResponseMessage_GBCSPayload
  return (
    x !== null && typeof x === 'object' && typeof x.GBCSPayload === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_LocalCommand(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_LocalCommand {
  const x = o as SimplifiedDuisResponse_ResponseMessage_LocalCommand
  return (
    x !== null &&
    typeof x === 'object' &&
    x.LocalCommand !== null &&
    typeof x.LocalCommand === 'object' &&
    typeof x.LocalCommand.GBCSPayload === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_PreCommand(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_PreCommand {
  const x = o as SimplifiedDuisResponse_ResponseMessage_PreCommand
  return (
    x !== null &&
    typeof x === 'object' &&
    x.PreCommand !== null &&
    typeof x.PreCommand === 'object' &&
    typeof x.PreCommand.GBCSPayload === 'string' &&
    typeof x.PreCommand.GBCSVersion === 'string'
  )
}

export function isSimplifiedDuisResponse_ResponseMessage_NoBody(
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage_NoBody {
  const x = o as SimplifiedDuisResponse_ResponseMessage_NoBody
  return (
    x !== null &&
    typeof x === 'object' &&
    /* ensure not additional keys */
    Object.keys(x).every(
      (k) => k === 'ServiceReference' || k === 'ServiceReferenceVariant'
    )
  )
}

export function _isSimplifiedDuisResponseBody_ResponseMessage<R>(
  o: unknown,
  isR: (o: unknown) => o is R
): o is SimplifiedDuisResponse_ResponseMessage<R> {
  const x = o as SimplifiedDuisResponse_ResponseMessage<R>
  return (
    x !== null &&
    typeof x === 'object' &&
    x.ResponseMessage !== null &&
    typeof x.ResponseMessage === 'object' &&
    typeof x.ResponseMessage.ServiceReference === 'string' &&
    typeof x.ResponseMessage.ServiceReferenceVariant === 'string' &&
    isR(x.ResponseMessage)
  )
}

export type SimplifiedDuisResponseBody_ResponseMessage_Payload =
  | 'CINMessage'
  | 'DSPInventory'
  | 'DSPOptIn'
  | 'DSPSchedulesRead'
  | 'DSPScheduledMessage'
  | 'DSPScheduleID'
  | 'DSPUpdateFirmwareWarning'
  | 'DSPUpdatePPMIDFirmwareWarning'
  | 'DSPWANMatrix'
  | 'FutureDatedDeviceAlertMessage'
  | 'GBCSPayload'
  | 'LocalCommand'
  | 'PreCommand'
  | 'NoBody'

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'CINMessage',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_CINMessage>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPInventory',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPInventory>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPOptIn',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPOptIn>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPSchedulesRead',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPScheduledMessage',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPScheduleID',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduleID>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPUpdateFirmwareWarning',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPUpdatePPMIDFirmwareWarning',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'DSPWANMatrix',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'FutureDatedDeviceAlertMessage',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'GBCSPayload',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_GBCSPayload>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'LocalCommand',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_LocalCommand>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'PreCommand',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_PreCommand>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'PreCommand',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_PreCommand>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: 'NoBody',
  o: unknown
): o is SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_NoBody>

export function isSimplifiedDuisResponseBody_ResponseMessage_X(
  type: SimplifiedDuisResponseBody_ResponseMessage_Payload,
  o: unknown
): o is
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_CINMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPInventory>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPOptIn>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduleID>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_GBCSPayload>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_LocalCommand>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_PreCommand>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_NoBody> {
  switch (type) {
    case 'CINMessage':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_CINMessage
      )
    case 'DSPInventory':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPInventory
      )

    case 'DSPOptIn':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPOptIn
      )

    case 'DSPSchedulesRead':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead
      )

    case 'DSPScheduledMessage':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage
      )

    case 'DSPScheduleID':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPScheduleID
      )

    case 'DSPUpdateFirmwareWarning':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning
      )

    case 'DSPUpdatePPMIDFirmwareWarning':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning
      )

    case 'DSPWANMatrix':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_DSPWANMatrix
      )

    case 'FutureDatedDeviceAlertMessage':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage
      )
    case 'GBCSPayload':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_GBCSPayload
      )
    case 'LocalCommand':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_LocalCommand
      )

    case 'PreCommand':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_PreCommand
      )

    case 'NoBody':
      return _isSimplifiedDuisResponseBody_ResponseMessage(
        o,
        isSimplifiedDuisResponse_ResponseMessage_NoBody
      )
  }
}

export function isSimplifiedDuisResponseBody_ResponseMessage_Any(
  o: unknown
): o is
  | SimplifiedDuisResponse_ResponseMessage_CINMessage
  | SimplifiedDuisResponse_ResponseMessage_DSPInventory
  | SimplifiedDuisResponse_ResponseMessage_DSPOptIn
  | SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead
  | SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage
  | SimplifiedDuisResponse_ResponseMessage_DSPScheduleID
  | SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning
  | SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning
  | SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix
  | SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage
  | SimplifiedDuisResponse_ResponseMessage_GBCSPayload
  | SimplifiedDuisResponse_ResponseMessage_LocalCommand
  | SimplifiedDuisResponse_ResponseMessage_PreCommand
  | SimplifiedDuisResponse_ResponseMessage_NoBody {
  return (
    isSimplifiedDuisResponse_ResponseMessage_CINMessage(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPInventory(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPOptIn(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPScheduleID(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning(o) ||
    isSimplifiedDuisResponse_ResponseMessage_DSPWANMatrix(o) ||
    isSimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage(o) ||
    isSimplifiedDuisResponse_ResponseMessage_GBCSPayload(o) ||
    isSimplifiedDuisResponse_ResponseMessage_LocalCommand(o) ||
    isSimplifiedDuisResponse_ResponseMessage_PreCommand(o) ||
    isSimplifiedDuisResponse_ResponseMessage_NoBody(o)
  )
}

export function isSimplifiedDuisResponseBody_ResponseMessage(
  o: unknown
): o is
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_CINMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPInventory>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPOptIn>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPSchedulesRead>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduledMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPScheduleID>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdateFirmwareWarning>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPUpdatePPMIDFirmwareWarning>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_DSPWANMatrix>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_FutureDatedDeviceAlertMessage>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_GBCSPayload>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_LocalCommand>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_PreCommand>
  | SimplifiedDuisResponse_ResponseMessage<SimplifiedDuisResponse_ResponseMessage_NoBody> {
  return _isSimplifiedDuisResponseBody_ResponseMessage(
    o,
    isSimplifiedDuisResponseBody_ResponseMessage_Any
  )
}

export function isSimplifiedDuisResponseBody_DeviceAlertMessage(
  o: unknown
): o is SimplifiedDuisResponse_DeviceAlertMessage {
  const x = o as SimplifiedDuisResponse_DeviceAlertMessage
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DeviceAlertMessage !== null &&
    typeof x.DeviceAlertMessage === 'object' &&
    typeof x.DeviceAlertMessage.AlertCode === 'string' &&
    ['number', 'undefined'].indexOf(
      typeof x.DeviceAlertMessage.ThrottledAlertSequenceId
    ) >= 0 &&
    ['number', 'undefined'].indexOf(
      typeof x.DeviceAlertMessage.ThrottledAlertCount
    ) >= 0 &&
    typeof x.DeviceAlertMessage.GBCSPayload === 'string'
  )
}

export function isSimplifiedDuisResponseBody_DCCAlertMessage(
  o: unknown
): o is SimplifiedDuisResponse_DCCAlertMessage {
  const x = o as SimplifiedDuisResponse_DCCAlertMessage
  return (
    x !== null &&
    typeof x === 'object' &&
    x.DCCAlertMessage !== null &&
    typeof x.DCCAlertMessage === 'object' &&
    typeof x.DCCAlertMessage.DCCAlertCode === 'string' &&
    ['number', 'undefined'].indexOf(
      typeof x.DCCAlertMessage.ThrottledAlertSequenceId
    ) >= 0 &&
    ['number', 'undefined'].indexOf(
      typeof x.DCCAlertMessage.ThrottledAlertCount
    ) >= 0 &&
    isXMLData(x.DCCAlertMessage.DCCAlert)
  )
}

export function isSimplifiedDuisResponseBody(
  o: unknown
): o is SimplifiedDuisResponseBody {
  return (
    isSimplifiedDuisResponseBody_ResponseMessage(o) ||
    isSimplifiedDuisResponseBody_DeviceAlertMessage(o) ||
    isSimplifiedDuisResponseBody_DCCAlertMessage(o)
  )
}

export function isSimplifiedDuisOutput(o: unknown): o is SimplifiedDuisOutput {
  return isSimplifiedDuis<
    CommandVariant,
    ServiceReferenceVariant,
    SimplifiedDuisResponseBody
  >(
    o,
    isCommandVariant,
    isServiceReferenceVariant,
    isSimplifiedDuisResponseBody
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
  return isSimplifiedDuisResponse(o, isSimplifiedDuisResponseBody)
}

export function isSimplifiedDuisInput(o: unknown): o is SimplifiedDuisInput {
  return isSimplifiedDuis<
    CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    ServiceReferenceVariant | string,
    SimplifiedDuisResponseBody
  >(
    o,
    (o: unknown): o is CommandVariant | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 => {
      return (typeof o === 'number' && o >= 1 && o <= 8) || isCommandVariant(o)
    },
    (o: unknown): o is ServiceReferenceVariant | string => {
      return typeof o === 'string' || isServiceReferenceVariant(o)
    },
    isSimplifiedDuisResponseBody
  )
}
