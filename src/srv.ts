import matrix from './duis-request-matrix.json'

export interface ServiceReferenceVariant {
  'Service Request Name': string
  'Service Reference': string
  'Service Reference Variant': string
  Critical: 'Yes' | 'No'
  'On Demand': 'Yes' | 'No'
  'Future Dated Response Pattern': string
  'DCC Scheduled': 'Yes' | 'No'
  'Non-Device Request': 'Yes' | 'No'
  'Eligible User Roles': ('IS' | 'ES' | 'GS' | 'RSA' | 'ED' | 'GT' | 'OU')[]
}

export function lookupSRV(srv: string): ServiceReferenceVariant | undefined {
  return matrix.find(
    (q) => q['Service Reference Variant'] === srv
  ) as ServiceReferenceVariant
}

export function isServiceReferenceVariant(
  o: unknown
): o is ServiceReferenceVariant {
  const x = o as ServiceReferenceVariant
  const p =
    x !== null &&
    typeof x === 'object' &&
    typeof x['Service Request Name'] === 'string' &&
    typeof x['Service Reference'] === 'string' &&
    typeof x['Service Reference Variant'] === 'string' &&
    typeof x['Critical'] === 'string' &&
    typeof x['On Demand'] === 'string' &&
    typeof x['Future Dated Response Pattern'] === 'string' &&
    typeof x['DCC Scheduled'] === 'string' &&
    typeof x['Non-Device Request'] === 'string' &&
    Array.isArray(x['Eligible User Roles'])
  if (p) {
    const candidate = lookupSRV(x['Service Reference Variant'])
    if (candidate) {
      return (
        x['Service Request Name'] === candidate['Service Request Name'] &&
        x['Service Reference'] === candidate['Service Reference'] &&
        x.Critical === candidate.Critical &&
        x['On Demand'] === candidate['On Demand'] &&
        x['Future Dated Response Pattern'] ===
          candidate['Future Dated Response Pattern'] &&
        x['DCC Scheduled'] === candidate['DCC Scheduled'] &&
        x['Non-Device Request'] === candidate['Non-Device Request'] &&
        x['Eligible User Roles'].every(
          (role) => candidate['Eligible User Roles'].indexOf(role) >= 0
        ) &&
        candidate['Eligible User Roles'].every(
          (role) => x['Eligible User Roles'].indexOf(role) >= 0
        )
      )
    }
  }
  return false
}
