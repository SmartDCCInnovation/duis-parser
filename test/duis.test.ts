/*
 * Created on Fri Aug 19 2022
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

import * as duis from '../src/duis'
import * as index from '../src/index'

describe('isSimplifiedDuisResponseBody', () => {
  test('undefined', () => {
    expect(duis.isSimplifiedDuisResponseBody(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(duis.isSimplifiedDuisResponseBody(null)).toBeFalsy()
  })
  test('list', () => {
    expect(duis.isSimplifiedDuisResponseBody([])).toBeFalsy()
  })
  test('number', () => {
    expect(duis.isSimplifiedDuisResponseBody(5)).toBeFalsy()
  })
  test('string', () => {
    expect(duis.isSimplifiedDuisResponseBody('')).toBeFalsy()
  })
  test('empty', () => {
    expect(duis.isSimplifiedDuisResponseBody({})).toBeFalsy()
  })

  describe('RequestMessage', () => {
    test('DSPInventory', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
            DSPInventory: {
              GBCSPayload:
                '3QAAAAAAAFARAAAAAN8JAgAAAYK1BKJYCLwzrP/++lU9CJCz1R8wAAACABIAWADbEjRWeAAEAAABgrUEoGcM2iAEolgAAAEAAQIAAAuhIVo18RHdOSFSww==',
              CustomerIdentificationNumber: '7116',
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPInventory', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '8.2',
            ServiceReferenceVariant: '8.2',
            DSPInventory: {
              Device: [
                {
                  DeviceID: '88-73-84-57-00-2F-96-1E',
                  DeviceType: 'CHF',
                  DeviceStatus: 'Pending',
                  DeviceManufacturer: 'AB01',
                  DeviceModel: '010A030B',
                  SMETSCHTSVersion: 'SMETS V1.58',
                  DeviceFirmwareVersion: '0002012F',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                  HANVariant: 'Single Band',
                },
                {
                  DeviceID: 'BC-33-AC-FF-FE-FA-55-3D',
                  DeviceType: 'ESME',
                  DeviceStatus: 'InstalledNotCommissioned',
                  DeviceManufacturer: 'GFI',
                  DeviceModel: '9001',
                  SMETSCHTSVersion: 'SMETS V5.0',
                  DeviceFirmwareVersion: '9001',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  ImportMPxN: '1312345678111',
                  ESMEVariant: 'A',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                },
                {
                  DeviceID: '88-73-84-FF-00-2F-96-1E',
                  DeviceType: 'GPF',
                  DeviceStatus: 'Pending',
                  DeviceManufacturer: 'AB01',
                  DeviceModel: '010A030B',
                  SMETSCHTSVersion: 'SMETS V1.58',
                  DeviceFirmwareVersion: '0002012F',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                },
              ],
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPOptIn', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '8.6',
            ServiceReferenceVariant: '8.6',
            DSPOptIn: {
              DeviceID: '00-11-22-33-44-55-66-77',
              DSPBrokerSecurityCredentialsDigitalSigning:
                'MIIBkjCCATigAwIBAgIQWH/llVPiZ1sMDipcQCqfYTAKBggqhkjOPQQDAjAaMQswCQYDVQQLEwIwNzELMAkGA1UEAxMCWjEwHhcNMTUxMDMwMDAwMDAwWhcNMjUxMDI5MjM1OTU5WjAhMQswCQYDVQQLDAIwNDESMBAGA1UELQMJAJCz1R8wAAACMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEheNGDcOKkF9yVYLkRlEoxAyJese2X2TehwxfCZpl/Z6iKLteDE8LXt4rQSjqOclu/Rdcp1mjnSFGWb1m0wLaNKNZMFcwDgYDVR0PAQH/BAQDAgeAMBEGA1UdDgQKBAhCaTU1093hATAdBgNVHSABAf8EEzARMA8GDSqGOgABhI+5DwECAQQwEwYDVR0jBAwwCoAIT1aI1+yTO+IwCgYIKoZIzj0EAwIDSAAwRQIgCOxbPoI5OYuLnFJCoocPyKSFU2YUD7jA/FssGwdiD5oCIQDXi6ZpEOxFfFdbhauMGewOIbN98R9ghm+oQ4JV6nzWjA==',
              DSPBrokerSecurityCredentialsKeyAgreement:
                'MIIBkzCCATigAwIBAgIQN83yBrB93vhS+8YpUPIu0DAKBggqhkjOPQQDAjAaMQswCQYDVQQLEwIwNzELMAkGA1UEAxMCWjEwHhcNMTUxMDMwMDAwMDAwWhcNMjUxMDI5MjM1OTU5WjAhMQswCQYDVQQLDAIwNDESMBAGA1UELQMJAJCz1R8wAAACMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqylqI2Mw7FuLTmvCRaS3LWYP87efklmk0jnQLcpIZSo8La08RORiTc+165nnYACurjOW2fWI8IFgzh3Rvvv+A6NZMFcwDgYDVR0PAQH/BAQDAgMIMBEGA1UdDgQKBAhKnOAsOauRCzAdBgNVHSABAf8EEzARMA8GDSqGOgABhI+5DwECAQQwEwYDVR0jBAwwCoAIT1aI1+yTO+IwCgYIKoZIzj0EAwIDSQAwRgIhAK6a4M+s7hMeTa0NyKZE6bgwD+7PTcivgnPlAlzEg+DMAiEA8rMfi8njFzrTim85D+gu2xmyRE79EYvNqd4HDLW/SHY=',
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPSchedulesRead', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '5.2',
            ServiceReferenceVariant: '5.2',
            DSPSchedulesRead: {
              DSPSchedules: {
                DSPScheduleID: '34',
                DSPScheduleDetails: {
                  ScheduleFrequency: 'Daily',
                  ScheduleStartDate: '2002-09-24',
                  DSPScheduledServiceReference: '4.12',
                  DSPScheduledServiceReferenceVariant: '4.12.1',
                  DeviceID: '00-11-22-33-44-55-66-77',
                  DSPReadMaximumDemandImportRegisters: '',
                },
              },
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPScheduledMessage', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '4.12',
            ServiceReferenceVariant: '4.12.1',
            DSPScheduledMessage: {
              DSPScheduleID: '34',
              GBCSPayload:
                '3QAAAAAAAIGVEQAAAADfCQEAAAGCtR41pQiQs9UfMAEAAAi8M6z//vpVPQACACdh2SAeNaUAAQMAHgAAKwII/wEBAgIBAQIFEgABCQYAAF4sIgoPAhIAAAICFgAAAQECAhYCAgUJCQQAAAGCtR41pQkIkLPVHzABAAAJCLwzrP/++lU9CQACAhYCAgIJAQIJAADeGsaL9D3jyvEWF3Q=',
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPScheduleID', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '5.1',
            ServiceReferenceVariant: '5.1',
            DSPScheduleID: '34',
          },
        })
      ).toBeTruthy()
    })

    test('DSPUpdateFirmwareWarning', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '11.1',
            ServiceReferenceVariant: '11.1',
            DSPUpdateFirmwareWarning: {
              NotCommissionedDeviceIDList: '00-11-22-33-44-55-66-77',
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPUpdatePPMIDFirmwareWarning', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '11.4',
            ServiceReferenceVariant: '11.4',
            DSPUpdatePPMIDFirmwareWarning: {
              InvalidDeviceIDList: '00-11-22-33-44-55-66-77',
            },
          },
        })
      ).toBeTruthy()
    })

    test('DSPWANMatrix', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '12.1',
            ServiceReferenceVariant: '12.1',
            DSPWANMatrix: {
              Request: { UPRN: '123456789123' },
              CSPRegion: 'Central',
              CoverageAvailability: 'true',
              WANTechnology: '30',
              ConnectivityLikelihood: 'Medium',
            },
          },
        })
      ).toBeTruthy()
    })

    test('FutureDatedDeviceAlertMessage', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '1.1',
            ServiceReferenceVariant: '1.1.1',
            FutureDatedDeviceAlertMessage: {
              FutureDatedAlertCode: '8F66',
              GBCSPayload:
                '3wkDAAAAAAAAB94IvDOs//76VT0IkLPVHzABAAAAAgDMLg8gAAfeAAIDEo9mCQwH7gEP/wkAAACAAP8JEwAZAAABgrbSHWsjKAAAXiyAHQZAm17yYB5fF+k1aLYBhafcM5cmydOvQPn697iw5/IkCkyTbYWsqv0wRGwd+O68HahQ4UlUEJKTNQuKR45spwxYJQ==',
              InstructionNumber: '2',
              TotalCommandInstructions: '6',
            },
          },
        })
      ).toBeTruthy()
    })

    test('GBCSPayload', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
            GBCSPayload:
              '3QAAAAAAAIGuEQAAAADfCQIAAAGCtSDaNwi8M6z//vpVPQiQs9UfMAEAAAwH5ggTBQgDHQCAAP8CACdu2iAg2jcAAAECAgEBAgIWAgIFCQkEAAABgrUg2jcJCLwzrP/++lU9CQiQs9UfMAEAAAkAAgIWAgICCQECCQAJKzEAAAAARE6KvTic2OslpcnrVP3Bt+2cq/4KQnHtTHN4/VXb88sI5Twb9p0BAwAA9FinTbspYHeLPLxg',
          },
        })
      ).toBeTruthy()
    })

    test('LocalCommand', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
            LocalCommand: {
              GBCSPayload:
                '3QAAAAAAAIGVEQAAAADfCQEAAAGCtR41pQiQs9UfMAEAAAi8M6z//vpVPQACACdh2SAeNaUAAQMAHgAAKwII/wEBAgIBAQIFEgABCQYAAF4sIgoPAhIAAAICFgAAAQECAhYCAgUJCQQAAAGCtR41pQkIkLPVHzABAAAJCLwzrP/++lU9CQACAhYCAgIJAQIJAADeGsaL9D3jyvEWF3Q=',
            },
          },
        })
      ).toBeTruthy()
    })

    test('PreCommand', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
            PreCommand: {
              GBCSVersion: '4.2',
              GBCSPayload:
                '3wkBAAABgrUONWIIkLPVHzABAAAIvDOs//76VT0AAgBibNkgDjViAAUCAAgAAAEAAP8JAwAIAAABAAD/BQMACAAAAQAA/wQBAAgAAAEAAP8CAQAIAAABAAD/BAUWBQIDCQz///////////+AAP8JDAfeDB//FzsKAIAA/wkMB98BAf8AAAoAgAD/DwAAAA==',
            },
          },
        })
      )
    })

    test('NoBody', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
          },
        })
      ).toBeTruthy()
    })

    test('Error', () => {
      expect(
        duis.isSimplifiedDuisResponseBody({
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
            SomeRecord: 'ok',
          },
        })
      ).toBeFalsy()
    })
  })

  test('DeviceAlertMessage', () => {
    expect(
      duis.isSimplifiedDuisResponseBody({
        DeviceAlertMessage: {
          AlertCode: '8F20',
          GBCSPayload:
            '3QAAAAAAAE0RAAAAAN8JAwAAAAAAAAfjCLwzrP/++lU9CJCz1R8wAQAAAAIQARkPIAAH4wACAhKPIAkMB+YIEwUQATsAgAD/AOm1BnvVLUvOhW4+sQ==',
        },
      })
    ).toBeTruthy()
  })

  test('DeviceAlertMessage', () => {
    expect(
      duis.isSimplifiedDuisResponseBody({
        DCCAlertMessage: {
          DCCAlertCode: 'N24',
          DCCAlert: {
            UpdateHANDeviceLogResult: {
              UpdateHANDeviceLogServiceRequestID:
                '90-b3-d5-1f-30-01-00-00:88-73-84-57-00-2f-96-1e:1660925173833',
            },
          },
        },
      })
    ).toBeTruthy()
  })
})

describe('isSimplifiedDuisResponseBody_ResponseMessage_X', () => {
  describe('CINMessage', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'CINMessage',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', null)
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', {
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
            CINMessage: {
              GBCSPayload:
                '3QAAAAAAAFARAAAAAN8JAgAAAYK1BKJYCLwzrP/++lU9CJCz1R8wAAACABIAWADbEjRWeAAEAAABgrUEoGcM2iAEolgAAAEAAQIAAAuhIVo18RHdOSFSww==',
              CustomerIdentificationNumber: '7116',
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', {
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
          },
        })
      ).toBeFalsy()
    })

    test('bad-cintype', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', {
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
            CINMessage: {
              GBCSPayload:
                '3QAAAAAAAFARAAAAAN8JAgAAAYK1BKJYCLwzrP/++lU9CJCz1R8wAAACABIAWADbEjRWeAAEAAABgrUEoGcM2iAEolgAAAEAAQIAAAuhIVo18RHdOSFSww==',
              CustomerIdentificationNumber: 7116,
            },
          },
        })
      ).toBeFalsy()
    })

    test('missing-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('CINMessage', {
          ResponseMessage: {
            ServiceReference: '9.1',
            ServiceReferenceVariant: '9.1',
            CINMessage: {
              CustomerIdentificationNumber: '7116',
            },
          },
        })
      ).toBeFalsy()
    })
  })

  describe('DSPInventory', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPInventory',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPInventory',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', {
          ResponseMessage: {
            ServiceReference: '8.2',
            ServiceReferenceVariant: '8.2',
            DSPInventory: {
              Device: [
                {
                  DeviceID: '88-73-84-57-00-2F-96-1E',
                  DeviceType: 'CHF',
                  DeviceStatus: 'Pending',
                  DeviceManufacturer: 'AB01',
                  DeviceModel: '010A030B',
                  SMETSCHTSVersion: 'SMETS V1.58',
                  DeviceFirmwareVersion: '0002012F',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                  HANVariant: 'Single Band',
                },
                {
                  DeviceID: 'BC-33-AC-FF-FE-FA-55-3D',
                  DeviceType: 'ESME',
                  DeviceStatus: 'InstalledNotCommissioned',
                  DeviceManufacturer: 'GFI',
                  DeviceModel: '9001',
                  SMETSCHTSVersion: 'SMETS V5.0',
                  DeviceFirmwareVersion: '9001',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  ImportMPxN: '1312345678111',
                  ESMEVariant: 'A',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                },
                {
                  DeviceID: '88-73-84-FF-00-2F-96-1E',
                  DeviceType: 'GPF',
                  DeviceStatus: 'Pending',
                  DeviceManufacturer: 'AB01',
                  DeviceModel: '010A030B',
                  SMETSCHTSVersion: 'SMETS V1.58',
                  DeviceFirmwareVersion: '0002012F',
                  DeviceFirmwareVersionStatus: 'Active',
                  CPLStatus: 'Active',
                  UPRN: '123456789012',
                  PropertyFilter: {
                    PostCode: '1111-111',
                    AddressIdentifier: '12334',
                  },
                  CSPRegion: 'Central',
                  DeviceGBCSVersion: '4.2',
                },
              ],
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPInventory', {
          ResponseMessage: {
            ServiceReference: '8.2',
            ServiceReferenceVariant: '8.2',
          },
        })
      ).toBeFalsy()
    })
  })

  describe('DSPOptIn', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPOptIn',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', null)
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', {
          ResponseMessage: {
            ServiceReference: '8.6',
            ServiceReferenceVariant: '8.6',
            DSPOptIn: {
              DeviceID: '00-11-22-33-44-55-66-77',
              DSPBrokerSecurityCredentialsDigitalSigning:
                'MIIBkjCCATigAwIBAgIQWH/llVPiZ1sMDipcQCqfYTAKBggqhkjOPQQDAjAaMQswCQYDVQQLEwIwNzELMAkGA1UEAxMCWjEwHhcNMTUxMDMwMDAwMDAwWhcNMjUxMDI5MjM1OTU5WjAhMQswCQYDVQQLDAIwNDESMBAGA1UELQMJAJCz1R8wAAACMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEheNGDcOKkF9yVYLkRlEoxAyJese2X2TehwxfCZpl/Z6iKLteDE8LXt4rQSjqOclu/Rdcp1mjnSFGWb1m0wLaNKNZMFcwDgYDVR0PAQH/BAQDAgeAMBEGA1UdDgQKBAhCaTU1093hATAdBgNVHSABAf8EEzARMA8GDSqGOgABhI+5DwECAQQwEwYDVR0jBAwwCoAIT1aI1+yTO+IwCgYIKoZIzj0EAwIDSAAwRQIgCOxbPoI5OYuLnFJCoocPyKSFU2YUD7jA/FssGwdiD5oCIQDXi6ZpEOxFfFdbhauMGewOIbN98R9ghm+oQ4JV6nzWjA==',
              DSPBrokerSecurityCredentialsKeyAgreement:
                'MIIBkzCCATigAwIBAgIQN83yBrB93vhS+8YpUPIu0DAKBggqhkjOPQQDAjAaMQswCQYDVQQLEwIwNzELMAkGA1UEAxMCWjEwHhcNMTUxMDMwMDAwMDAwWhcNMjUxMDI5MjM1OTU5WjAhMQswCQYDVQQLDAIwNDESMBAGA1UELQMJAJCz1R8wAAACMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqylqI2Mw7FuLTmvCRaS3LWYP87efklmk0jnQLcpIZSo8La08RORiTc+165nnYACurjOW2fWI8IFgzh3Rvvv+A6NZMFcwDgYDVR0PAQH/BAQDAgMIMBEGA1UdDgQKBAhKnOAsOauRCzAdBgNVHSABAf8EEzARMA8GDSqGOgABhI+5DwECAQQwEwYDVR0jBAwwCoAIT1aI1+yTO+IwCgYIKoZIzj0EAwIDSQAwRgIhAK6a4M+s7hMeTa0NyKZE6bgwD+7PTcivgnPlAlzEg+DMAiEA8rMfi8njFzrTim85D+gu2xmyRE79EYvNqd4HDLW/SHY=',
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPOptIn', {
          ResponseMessage: {
            ServiceReference: '8.6',
            ServiceReferenceVariant: '8.6',
          },
        })
      ).toBeFalsy()
    })
  })

  describe('DSPSchedulesRead', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          5
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          {
            ResponseMessage: {
              ServiceReference: '5.2',
              ServiceReferenceVariant: '5.2',
              DSPSchedulesRead: {
                DSPSchedules: {
                  DSPScheduleID: '34',
                  DSPScheduleDetails: {
                    ScheduleFrequency: 'Daily',
                    ScheduleStartDate: '2002-09-24',
                    DSPScheduledServiceReference: '4.12',
                    DSPScheduledServiceReferenceVariant: '4.12.1',
                    DeviceID: '00-11-22-33-44-55-66-77',
                    DSPReadMaximumDemandImportRegisters: '',
                  },
                },
              },
            },
          }
        )
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPSchedulesRead',
          {
            ResponseMessage: {
              ServiceReference: '5.2',
              ServiceReferenceVariant: '5.2',
            },
          }
        )
      ).toBeFalsy()
    })
  })

  describe('DSPScheduledMessage', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          5
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          {
            ResponseMessage: {
              ServiceReference: '4.12',
              ServiceReferenceVariant: '4.12.1',
              DSPScheduledMessage: {
                DSPScheduleID: '34',
                GBCSPayload:
                  '3QAAAAAAAIGVEQAAAADfCQEAAAGCtR41pQiQs9UfMAEAAAi8M6z//vpVPQACACdh2SAeNaUAAQMAHgAAKwII/wEBAgIBAQIFEgABCQYAAF4sIgoPAhIAAAICFgAAAQECAhYCAgUJCQQAAAGCtR41pQkIkLPVHzABAAAJCLwzrP/++lU9CQACAhYCAgIJAQIJAADeGsaL9D3jyvEWF3Q=',
              },
            },
          }
        )
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          {
            ResponseMessage: {
              ServiceReference: '4.12',
              ServiceReferenceVariant: '4.12.1',
            },
          }
        )
      ).toBeFalsy()
    })

    test('bad-id', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          {
            ResponseMessage: {
              ServiceReference: '4.12',
              ServiceReferenceVariant: '4.12.1',
              DSPScheduledMessage: {
                DSPScheduleID: 34,
                GBCSPayload:
                  '3QAAAAAAAIGVEQAAAADfCQEAAAGCtR41pQiQs9UfMAEAAAi8M6z//vpVPQACACdh2SAeNaUAAQMAHgAAKwII/wEBAgIBAQIFEgABCQYAAF4sIgoPAhIAAAICFgAAAQECAhYCAgUJCQQAAAGCtR41pQkIkLPVHzABAAAJCLwzrP/++lU9CQACAhYCAgIJAQIJAADeGsaL9D3jyvEWF3Q=',
              },
            },
          }
        )
      ).toBeFalsy()
    })

    test('missing-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduledMessage',
          {
            ResponseMessage: {
              ServiceReference: '4.12',
              ServiceReferenceVariant: '4.12.1',
              DSPScheduledMessage: {
                DSPScheduleID: '34',
              },
            },
          }
        )
      ).toBeFalsy()
    })
  })

  describe('DSPScheduleID', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduleID',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduleID',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduleID',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPScheduleID', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduleID',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPScheduleID',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPScheduleID', {
          ResponseMessage: {
            ServiceReference: '5.1',
            ServiceReferenceVariant: '5.1',
            DSPScheduleID: '34',
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPScheduleID', {
          ResponseMessage: {
            ServiceReference: '5.1',
            ServiceReferenceVariant: '5.1',
          },
        })
      ).toBeFalsy()
    })

    test('bad-tyope', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPScheduleID', {
          ResponseMessage: {
            ServiceReference: '5.1',
            ServiceReferenceVariant: '5.1',
            DSPScheduleID: 34,
          },
        })
      ).toBeFalsy()
    })
  })

  describe('DSPUpdateFirmwareWarning', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          5
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          {
            ResponseMessage: {
              ServiceReference: '11.1',
              ServiceReferenceVariant: '11.1',
              DSPUpdateFirmwareWarning: {
                NotCommissionedDeviceIDList: '00-11-22-33-44-55-66-77',
              },
            },
          }
        )
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdateFirmwareWarning',
          {
            ResponseMessage: {
              ServiceReference: '11.1',
              ServiceReferenceVariant: '11.1',
            },
          }
        )
      ).toBeFalsy()
    })
  })

  describe('DSPUpdatePPMIDFirmwareWarning', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          5
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          {
            ResponseMessage: {
              ServiceReference: '11.4',
              ServiceReferenceVariant: '11.4',
              DSPUpdatePPMIDFirmwareWarning: {
                NotCommissionedDeviceIDList: '00-11-22-33-44-55-66-77',
              },
            },
          }
        )
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPUpdatePPMIDFirmwareWarning',
          {
            ResponseMessage: {
              ServiceReference: '11.4',
              ServiceReferenceVariant: '11.4',
            },
          }
        )
      ).toBeFalsy()
    })
  })

  describe('DSPWANMatrix', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPWANMatrix',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'DSPWANMatrix',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', {
          ResponseMessage: {
            ServiceReference: '12.1',
            ServiceReferenceVariant: '12.1',
            DSPWANMatrix: {
              Request: { UPRN: '123456789123' },
              CSPRegion: 'Central',
              CoverageAvailability: 'true',
              WANTechnology: '30',
              ConnectivityLikelihood: 'Medium',
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('DSPWANMatrix', {
          ResponseMessage: {
            ServiceReference: '12.1',
            ServiceReferenceVariant: '12.1',
          },
        })
      ).toBeFalsy()
    })
  })

  describe('FutureDatedDeviceAlertMessage', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          []
        )
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          5
        )
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          ''
        )
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {}
        )
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
              FutureDatedDeviceAlertMessage: {
                FutureDatedAlertCode: '8F66',
                GBCSPayload:
                  '3wkDAAAAAAAAB94IvDOs//76VT0IkLPVHzABAAAAAgDMLg8gAAfeAAIDEo9mCQwH7gEP/wkAAACAAP8JEwAZAAABgrbSHWsjKAAAXiyAHQZAm17yYB5fF+k1aLYBhafcM5cmydOvQPn697iw5/IkCkyTbYWsqv0wRGwd+O68HahQ4UlUEJKTNQuKR45spwxYJQ==',
                InstructionNumber: '2',
                TotalCommandInstructions: '6',
              },
            },
          }
        )
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
            },
          }
        )
      ).toBeFalsy()
    })

    test('bad-alertcode', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
              FutureDatedDeviceAlertMessage: {
                FutureDatedAlertCode: 0x8f66,
                GBCSPayload:
                  '3wkDAAAAAAAAB94IvDOs//76VT0IkLPVHzABAAAAAgDMLg8gAAfeAAIDEo9mCQwH7gEP/wkAAACAAP8JEwAZAAABgrbSHWsjKAAAXiyAHQZAm17yYB5fF+k1aLYBhafcM5cmydOvQPn697iw5/IkCkyTbYWsqv0wRGwd+O68HahQ4UlUEJKTNQuKR45spwxYJQ==',
                InstructionNumber: '2',
                TotalCommandInstructions: '6',
              },
            },
          }
        )
      ).toBeFalsy()
    })

    test('missing-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
              FutureDatedDeviceAlertMessage: {
                FutureDatedAlertCode: '8F66',
                InstructionNumber: '2',
                TotalCommandInstructions: '6',
              },
            },
          }
        )
      ).toBeFalsy()
    })

    test('bad-instructionNumber', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
              FutureDatedDeviceAlertMessage: {
                FutureDatedAlertCode: '8F66',
                GBCSPayload:
                  '3wkDAAAAAAAAB94IvDOs//76VT0IkLPVHzABAAAAAgDMLg8gAAfeAAIDEo9mCQwH7gEP/wkAAACAAP8JEwAZAAABgrbSHWsjKAAAXiyAHQZAm17yYB5fF+k1aLYBhafcM5cmydOvQPn697iw5/IkCkyTbYWsqv0wRGwd+O68HahQ4UlUEJKTNQuKR45spwxYJQ==',
                InstructionNumber: 2,
                TotalCommandInstructions: '6',
              },
            },
          }
        )
      ).toBeFalsy()
    })

    test('bad-totalCommandInstructions', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'FutureDatedDeviceAlertMessage',
          {
            ResponseMessage: {
              ServiceReference: '1.1',
              ServiceReferenceVariant: '1.1.1',
              FutureDatedDeviceAlertMessage: {
                FutureDatedAlertCode: '8F66',
                GBCSPayload:
                  '3wkDAAAAAAAAB94IvDOs//76VT0IkLPVHzABAAAAAgDMLg8gAAfeAAIDEo9mCQwH7gEP/wkAAACAAP8JEwAZAAABgrbSHWsjKAAAXiyAHQZAm17yYB5fF+k1aLYBhafcM5cmydOvQPn697iw5/IkCkyTbYWsqv0wRGwd+O68HahQ4UlUEJKTNQuKR45spwxYJQ==',
                InstructionNumber: '2',
                TotalCommandInstructions: 6,
              },
            },
          }
        )
      ).toBeFalsy()
    })
  })

  describe('GBCSPayload', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'GBCSPayload',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'GBCSPayload',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', {
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
            GBCSPayload:
              '3QAAAAAAAIGuEQAAAADfCQIAAAGCtSDaNwi8M6z//vpVPQiQs9UfMAEAAAwH5ggTBQgDHQCAAP8CACdu2iAg2jcAAAECAgEBAgIWAgIFCQkEAAABgrUg2jcJCLwzrP/++lU9CQiQs9UfMAEAAAkAAgIWAgICCQECCQAJKzEAAAAARE6KvTic2OslpcnrVP3Bt+2cq/4KQnHtTHN4/VXb88sI5Twb9p0BAwAA9FinTbspYHeLPLxg',
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', {
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
          },
        })
      ).toBeFalsy()
    })

    test('bad-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', {
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
            GBCSPayload: {},
          },
        })
      ).toBeFalsy()
    })
  })

  describe('LocalCommand', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'LocalCommand',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'LocalCommand',
          null
        )
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', {
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
            LocalCommand: {
              GBCSPayload:
                '3QAAAAAAAIGVEQAAAADfCQEAAAGCtR41pQiQs9UfMAEAAAi8M6z//vpVPQACACdh2SAeNaUAAQMAHgAAKwII/wEBAgIBAQIFEgABCQYAAF4sIgoPAhIAAAICFgAAAQECAhYCAgUJCQQAAAGCtR41pQkIkLPVHzABAAAJCLwzrP/++lU9CQACAhYCAgIJAQIJAADeGsaL9D3jyvEWF3Q=',
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', {
          ResponseMessage: {
            ServiceReference: '4.1',
            ServiceReferenceVariant: '4.1.1',
          },
        })
      ).toBeFalsy()
    })

    test('missing-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('LocalCommand', {
          ResponseMessage: {
            ServiceReference: '1.1',
            ServiceReferenceVariant: '1.1.1',
            LocalCommand: {},
          },
        })
      ).toBeFalsy()
    })
  })

  describe('PreCommand', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'PreCommand',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', null)
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
            PreCommand: {
              GBCSVersion: '4.2',
              GBCSPayload:
                '3wkBAAABgrUONWIIkLPVHzABAAAIvDOs//76VT0AAgBibNkgDjViAAUCAAgAAAEAAP8JAwAIAAABAAD/BQMACAAAAQAA/wQBAAgAAAEAAP8CAQAIAAABAAD/BAUWBQIDCQz///////////+AAP8JDAfeDB//FzsKAIAA/wkMB98BAf8AAAoAgAD/DwAAAA==',
            },
          },
        })
      ).toBeTruthy()
    })

    test('missing', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
          },
        })
      ).toBeFalsy()
    })

    test('missing-gbcs', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
            PreCommand: {
              GBCSVersion: '4.2',
            },
          },
        })
      ).toBeFalsy()
    })

    test('bad-version', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('PreCommand', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
            PreCommand: {
              GBCSVersion: 4.2,
              GBCSPayload:
                '3wkBAAABgrUONWIIkLPVHzABAAAIvDOs//76VT0AAgBibNkgDjViAAUCAAgAAAEAAP8JAwAIAAABAAD/BQMACAAAAQAA/wQBAAgAAAEAAP8CAQAIAAABAAD/BAUWBQIDCQz///////////+AAP8JDAfeDB//FzsKAIAA/wkMB98BAf8AAAoAgAD/DwAAAA==',
            },
          },
        })
      ).toBeFalsy()
    })
  })

  describe('NoBody', () => {
    test('undefined', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X(
          'NoBody',
          undefined
        )
      ).toBeFalsy()
    })
    test('null', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', null)
      ).toBeFalsy()
    })
    test('list', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', [])
      ).toBeFalsy()
    })
    test('number', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', 5)
      ).toBeFalsy()
    })
    test('string', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', '')
      ).toBeFalsy()
    })
    test('empty', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', {})
      ).toBeFalsy()
    })

    test('nominal', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
          },
        })
      ).toBeTruthy()
    })

    test('extra', () => {
      expect(
        index.isSimplifiedDuisResponseBody_ResponseMessage_X('NoBody', {
          ResponseMessage: {
            ServiceReference: '6.11',
            ServiceReferenceVariant: '6.11',
            Hello: 'World',
          },
        })
      ).toBeFalsy()
    })
  })
})
