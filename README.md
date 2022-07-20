# DUIS Parser

Lightweight wrapper around `fast-xml-parser` that converts between JSON and
[DUIS][duis] formats. This tool has been developed to provide an easy to use
client side parser for [DCC Boxed][boxed]. XML schema validation and digital
signatures are out of scope of this tool, and it is intended to be used in
conjunction with [SmartDCCInnovation/dccboxed-signing-tool][sign] which provides
these features.

## Usage

Developed using typescript with `node 16`.

TODO

### Parse DUIS

```ts
import { parseDuis } from '@smartdcc/duis-parser'
import { readFile } from 'node:fs/promises'

const duis = parseDuis('simplified', await readFile('/path/to/duis/file.xml'))
```

For example, a parsed *Read Instantaneous Import Registers* (SRV 4.1.1) could
yield the following:

```js
duis = {
  header: {
    commandVariant: {...metadata},
    requestId: {
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a3',
      counter: 1000,
    },
    serviceReference: '4.1',
    serviceReferenceVariant: '4.1.1',
  },
  body: {
    ReadInstantaneousImportRegisters: '',
  },
}
```


### Construct DUIS

Then to reconstruct the result back into a DUIS file:

```ts
import { constructDuis } from '@smartdcc/duis-parser'

const xml: string = constructDuis('simplified', duis)
```

To sign the resulting string, please see the
[SmartDCCInnovation/dccboxed-signing-tool][sign] tool.

### Advanced

In both examples above, `simplified` was used. This is recommended as it strips
out the XML digital signature (if present), parses the header into a more
manageable structure and removes the namespaces so it is more manageable. 


## Other Info

Copyright 2022, Smart DCC Limited, All rights reserved. Project is licensed under GLPv3.


[duis]: https://smartenergycodecompany.co.uk/the-smart-energy-code-2/ "Smart Energy Code"
[boxed]: https://www.smartdcc.co.uk/our-smart-network/network-products-services/dcc-boxed/ "DCC Boxed"
[sign]: https://github.com/SmartDCCInnovation/dccboxed-signing-tool "DCC Boxed Signing Tool"