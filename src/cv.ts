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

export type CommandVariant =
  | {
      number: 1
      description: 'Non Critical Service Request for Command to be sent to a Device via the SM WAN'
      input: 'Service Request'
      output: 'Command'
      webService: 'Send Command Service'
      critical: 'No'
    }
  | {
      number: 2
      description: 'Non Critical Service Request for Command to be returned to the User for local delivery to a Device'
      input: 'Service Request'
      output: 'Command for Local Delivery'
      webService: 'Non-Device Service'
      critical: 'No'
    }
  | {
      number: 3
      description: 'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery'
      input: 'Service Request'
      output: 'Command and Command for Local Delivery'
      webService: 'Send Command Service'
      critical: 'No'
    }
  | {
      number: 4
      description: 'Transform Critical Service Request and return Pre-Command to User for Correlation and Digital Signing'
      input: 'Service Request'
      output: 'Pre-Command'
      webService: 'Transform Service'
      critical: 'No'
    }
  | {
      number: 5
      description: 'Critical Signed Pre- Command indicating Command to be sent to a Device via the SM WAN'
      input: 'Signed Pre-Command'
      output: 'Command'
      webService: 'Send Command Service'
      critical: 'Yes'
    }
  | {
      number: 6
      description: 'Critical Signed Pre-Command indicating Command to be returned to the User for local delivery to a Device'
      input: 'Signed Pre-Command'
      output: 'Command for Local Delivery'
      webService: 'Non-Device Service'
      critical: 'Yes'
    }
  | {
      number: 7
      description: 'Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery'
      input: 'Signed Pre-Command'
      output: 'Command and Command for Local Delivery'
      webService: 'Send Command Service'
      critical: 'Yes'
    }
  | {
      number: 8
      description: 'Request a Non-Device Service'
      input: 'Service Request'
      output: 'Service Response'
      webService: 'Non-Device Service'
      critical: 'No'
    }

const cvs: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, CommandVariant> = {
  1: {
    number: 1,
    description:
      'Non Critical Service Request for Command to be sent to a Device via the SM WAN',
    input: 'Service Request',
    output: 'Command',
    webService: 'Send Command Service',
    critical: 'No',
  },
  2: {
    number: 2,
    description:
      'Non Critical Service Request for Command to be returned to the User for local delivery to a Device',
    input: 'Service Request',
    output: 'Command for Local Delivery',
    webService: 'Non-Device Service',
    critical: 'No',
  },
  3: {
    number: 3,
    description:
      'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
    input: 'Service Request',
    output: 'Command and Command for Local Delivery',
    webService: 'Send Command Service',
    critical: 'No',
  },
  4: {
    number: 4,
    description:
      'Transform Critical Service Request and return Pre-Command to User for Correlation and Digital Signing',
    input: 'Service Request',
    output: 'Pre-Command',
    webService: 'Transform Service',
    critical: 'No',
  },
  5: {
    number: 5,
    description:
      'Critical Signed Pre- Command indicating Command to be sent to a Device via the SM WAN',
    input: 'Signed Pre-Command',
    output: 'Command',
    webService: 'Send Command Service',
    critical: 'Yes',
  },
  6: {
    number: 6,
    description:
      'Critical Signed Pre-Command indicating Command to be returned to the User for local delivery to a Device',
    input: 'Signed Pre-Command',
    output: 'Command for Local Delivery',
    webService: 'Non-Device Service',
    critical: 'Yes',
  },
  7: {
    number: 7,
    description:
      'Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery',
    input: 'Signed Pre-Command',
    output: 'Command and Command for Local Delivery',
    webService: 'Send Command Service',
    critical: 'Yes',
  },
  8: {
    number: 8,
    description: 'Request a Non-Device Service',
    input: 'Service Request',
    output: 'Service Response',
    webService: 'Non-Device Service',
    critical: 'No',
  },
}

/* 
  below definitions ensure referential transparency is defined at the type level
*/

export function lookupCV(cv: 1): {
  number: 1
  description: 'Non Critical Service Request for Command to be sent to a Device via the SM WAN'
  input: 'Service Request'
  output: 'Command'
  webService: 'Send Command Service'
  critical: 'No'
}
export function lookupCV(cv: 2): {
  number: 2
  description: 'Non Critical Service Request for Command to be returned to the User for local delivery to a Device'
  input: 'Service Request'
  output: 'Command for Local Delivery'
  webService: 'Non-Device Service'
  critical: 'No'
}
export function lookupCV(cv: 3): {
  number: 3
  description: 'Non Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery'
  input: 'Service Request'
  output: 'Command and Command for Local Delivery'
  webService: 'Send Command Service'
  critical: 'No'
}
export function lookupCV(cv: 4): {
  number: 4
  description: 'Transform Critical Service Request and return Pre-Command to User for Correlation and Digital Signing'
  input: 'Service Request'
  output: 'Pre-Command'
  webService: 'Transform Service'
  critical: 'No'
}
export function lookupCV(cv: 5): {
  number: 5
  description: 'Critical Signed Pre- Command indicating Command to be sent to a Device via the SM WAN'
  input: 'Signed Pre-Command'
  output: 'Command'
  webService: 'Send Command Service'
  critical: 'Yes'
}
export function lookupCV(cv: 6): {
  number: 6
  description: 'Critical Signed Pre-Command indicating Command to be returned to the User for local delivery to a Device'
  input: 'Signed Pre-Command'
  output: 'Command for Local Delivery'
  webService: 'Non-Device Service'
  critical: 'Yes'
}
export function lookupCV(cv: 7): {
  number: 7
  description: 'Critical Service Request for Command to be sent to a Device via the SM WAN as well as a copy to be returned to the User for local delivery'
  input: 'Signed Pre-Command'
  output: 'Command and Command for Local Delivery'
  webService: 'Send Command Service'
  critical: 'Yes'
}
export function lookupCV(cv: 8): {
  number: 8
  description: 'Request a Non-Device Service'
  input: 'Service Request'
  output: 'Service Response'
  webService: 'Non-Device Service'
  critical: 'No'
}

export function lookupCV(cv: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): CommandVariant

export function lookupCV(cv: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): CommandVariant {
  if (cv in cvs) {
    return cvs[cv]
  }
  throw new Error('cv out of range')
}

export function isCommandVariant(o: unknown): o is CommandVariant {
  const x = o as CommandVariant
  const p = x !== null && typeof x === 'object' && typeof x.number === 'number'
  if (p) {
    try {
      const spec = lookupCV(x.number)
      return Object.keys(spec).every(
        (k) =>
          (spec as Record<string, string | number>)[k] ===
          (x as Record<string, string | number>)[k],
      )
    } catch {
      return false
    }
  }
  return false
}
