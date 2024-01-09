![GitHub banner](https://user-images.githubusercontent.com/527411/192760138-a1f61694-f705-4358-b419-e5eeb78c2ea0.png)

# DUIS Parser

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Tests](https://github.com/SmartDCCInnovation/duis-parser/actions/workflows/node.yml/badge.svg?branch=main&event=push)](https://github.com/SmartDCCInnovation/duis-parser/actions/workflows/node.yml)
[![codecov](https://codecov.io/gh/SmartDCCInnovation/duis-parser/branch/main/graph/badge.svg?token=WC8CIK1CBV)](https://codecov.io/gh/SmartDCCInnovation/duis-parser)
[![GitHub version](https://badge.fury.io/gh/SmartDCCInnovation%2Fduis-parser.svg)](https://badge.fury.io/gh/SmartDCCInnovation%2Fduis-parser)

Lightweight wrapper around `fast-xml-parser` that converts between JSON and
[DUIS][duis] formats. This tool has been developed to provide an easy to use
client side parser for [DCC Boxed][boxed]. XML schema validation and digital
signatures are out of scope of this tool, and it is intended to be used in
conjunction with [SmartDCCInnovation/dccboxed-signing-tool][sign] which provides
these features.

## Usage

### Requirements

Developed and tested against `node 16`. Install from `npm`:

```
npm i @smartdcc/duis-parser
```

### Parse DUIS

```ts
import { parseDuis } from '@smartdcc/duis-parser'
import { readFile } from 'node:fs/promises'

const duis = parseDuis('simplified', await readFile('/path/to/duis/file.xml'))
```

For example, a parsed *Read Instantaneous Import Registers* (SRV 4.1.1) could
yield the following:

```js
{
  header: {
    type: 'request',
    requestId: {
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a0',
      counter: 1000n
    },
    commandVariant: {
      number: 1,
      description: 'Non Critical Service Request for Command to be sent to a Device via the SM WAN',
      input: 'Service Request',
      output: 'Command',
      webService: 'Send Command Service',
      critical: 'No'
    },
    serviceReference: '4.1',
    serviceReferenceVariant: {
      'Service Request Name': 'Read Instantaneous Import Registers',
      'Service Reference': '4.1',
      'Service Reference Variant': '4.1.1',
      Critical: 'No',
      'On Demand': 'Yes',
      'Future Dated Response Pattern': 'DSP',
      'DCC Scheduled': 'No',
      'Non-Device Request': 'No',
      'Eligible User Roles': [ 'IS', 'GS', 'ED', 'GT' ]
    }
  },
  body: { ReadInstantaneousImportRegisters: '' }
}
```

As a convenience, the `commandVariant` and `serviceReferenceVariant` items are
automatically converted from simple types (i.e. number and string, respectively)
into meta-data objects with human readable meanings. These items are extracted
from the [DUIS][duis] Word document, the interested reader should view the
[DUIS][duis] Word document (available for download from the Smart Energy Code
website) for their meanings.

To aid with interrogating a DUIS response to determine what type of response is
provided a number of utility functions are provided:

  * `isSimplifiedDuisInput`
  * `isSimplifiedDuisInputRequest`
  * `isSimplifiedDuisOutput`
  * `isSimplifiedDuisOutputRequest`
  * `isSimplifiedDuisOutputResponse`
  * `isSimplifiedDuisResponseBody_ResponseMessage_X`
  * `isSimplifiedDuisResponseBody_ResponseMessage`
  * `isSimplifiedDuisResponseBody_DeviceAlertMessage`
  * `isSimplifiedDuisResponseBody_DCCAlertMessage`
  * `isXMLData`

These can be used from TypeScript as type predicates. E.g.

```ts
const duis = parseDuis('simplified', await readFile('/path/to/duis/file.xml'))
if (
  isSimplifiedDuisOutputResponse(duis) &&
  isSimplifiedDuisResponseBody_ResponseMessage_X('GBCSPayload', duis.body)
) {
  /* duis.body.ResponseMessage.GBCSPayload is valid */
}
```

### Construct DUIS

Then to reconstruct the result back into a DUIS file:

```ts
import { constructDuis } from '@smartdcc/duis-parser'

const xml: string = constructDuis('simplified', duis)
```

When reconstructing, it is not required to give the full meta-data objects for
`commandVariant` and `serviceReferenceVariant`. Instead, their simple types can
be provided, thus the following will produce and equivalent XML as the example
above (notice).

```js
{
  header: {
    type: 'request',
    requestId: {
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a0',
      counter: 1000n
    },
    commandVariant: 1,
    serviceReference: '4.1',
    serviceReferenceVariant: '4.1.1'
  },
  body: { ReadInstantaneousImportRegisters: '' }
}
```

As another example. It is often not convenient (or necessary) to enter the
counter as a `BigInt` as in the above example, the counter can be provided as a
normal integer. This means the input can be JSON:

```json
{
    "header": {
        "type": "request",
        "requestId": {
            "originatorId": "90-b3-d5-1f-30-01-00-00",
            "targetId": "00-db-12-34-56-78-90-a0",
            "counter": 0
        },
        "commandVariant": 1,
        "serviceReference": "6.24",
        "serviceReferenceVariant": "6.24.1"
    },
    "body": {
        "RetrieveDeviceSecurityCredentialsKRP": {
            "RemotePartyRole": [{"#text": "Root"}, {"#text": "Supplier"}, {"#text": "TransCoS"}]
        }
    }
}
```

In the above example, the usage of `#text` is required to build multiple
`RemotePartyRole` entities. This is documented within the `fast-xml-parser`
manual. But as an example, if only one `RemotePartyRole` is needed, then this
can be simplified to:

```json
{
    "header": {
        "type": "request",
        "requestId": {
            "originatorId": "90-b3-d5-1f-30-01-00-00",
            "targetId": "00-db-12-34-56-78-90-a0",
            "counter": 0
        },
        "commandVariant": 1,
        "serviceReference": "6.24",
        "serviceReferenceVariant": "6.24.1"
    },
    "body": {
        "RetrieveDeviceSecurityCredentialsKRP": {
            "RemotePartyRole": "Supplier"
        }
    }
}
```

#### Signing DUIS

To sign the resulting payload from `constructDuis` for use with DCC Boxed,
please see the [SmartDCCInnovation/dccboxed-signing-tool][sign] tool.

### Advanced

In both examples above, `simplified` was used. This is recommended as it strips
out the XML digital signature (if present), enriches the header with meta-data
and removes the namespaces so it intuitive to use. 

Alternatively, a `normal` mode is provided that is close to the unprocessed
output from `fast-xml-parser` and has a direct correspondence with the original
XML. For example:

```ts
console.log(parseDuis('normal', await readFile('/path/to/duis/file.xml')))
```

Could output the following. While initially it looks more complex, this is
because the digital signature and XML namespaces are present.

```js
{
  '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
  'sr:Request': {
    'sr:Header': {
      'sr:RequestID': '90-B3-D5-1F-30-01-00-00:00-DB-12-34-56-78-90-A0:1000',
      'sr:CommandVariant': '1',
      'sr:ServiceReference': '4.1',
      'sr:ServiceReferenceVariant': '4.1.1'
    },
    'sr:Body': { 'sr:ReadInstantaneousImportRegisters': '' },
    'ds:Signature': {
      'ds:SignedInfo': {
        'ds:CanonicalizationMethod': { '@_Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#' },
        'ds:SignatureMethod': {
          '@_Algorithm': 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256'
        },
        'ds:Reference': {
          'ds:Transforms': {
            'ds:Transform': {
              '@_Algorithm': 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
            }
          },
          'ds:DigestMethod': { '@_Algorithm': 'http://www.w3.org/2001/04/xmlenc#sha256' },
          'ds:DigestValue': 'ZGVmYXVsdA==',
          '@_URI': ''
        }
      },
      'ds:SignatureValue': 'ZGVmYXVsdA==',
      'ds:KeyInfo': {
        'ds:X509Data': {
          'ds:X509IssuerSerial': {
            'ds:X509IssuerName': 'CN=U1, OU=07',
            'ds:X509SerialNumber': '1234567890'
          }
        }
      },
      '@_xmlns': 'http://www.w3.org/2000/09/xmldsig#'
    },
    '@_xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
    '@_xmlns:sr': 'http://www.dccinterface.co.uk/ServiceUserGateway',
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    '@_schemaVersion': '5.1'
  }
}
```

## Contributing

Contributions are welcome!

When submitting a pull request, please ensure:

  1. Each PR is concise and provides only one feature/bug fix.
  2. Unit test are provided to cover feature. The project uses `jest`. To test,
     run `npm run test:cov` to view code coverage metrics.
  3. Bugfixes are reference the GitHub issue.
  4. If appropriate, update documentation.
  5. Before committing, run `npm run lint` and `npm run prettier-check`.

If you are planning a new non-trivial feature, please first raise a GitHub issue
to discuss it to before investing your time to avoid disappointment.

Any contributions will be expected to be licensable under GPLv3.

## Other Info

Copyright 2022, Smart DCC Limited, All rights reserved. Project is licensed under GPLv3.


[duis]: https://smartenergycodecompany.co.uk/the-smart-energy-code-2/ "Smart Energy Code, see Appendix AD"
[boxed]: https://www.smartdcc.co.uk/our-smart-network/network-products-services/dcc-boxed/ "DCC Boxed"
[sign]: https://github.com/SmartDCCInnovation/dccboxed-signing-tool "DCC Boxed Signing Tool"
