export interface DeliveryAddressFields {
  city: string
  village?: string
  pincode: string
}

export function buildFullDeliveryAddress(fields: DeliveryAddressFields): string {
  const lines: string[] = []

  const cityLine = [fields.city.trim(), fields.village?.trim()].filter(Boolean).join(', ')
  if (cityLine) lines.push(cityLine)

  if (fields.pincode.trim()) {
    lines.push(`Pincode: ${fields.pincode.trim()}`)
  }

  return lines.join('\n')
}

export function validateDeliveryAddress(fields: DeliveryAddressFields): string | null {
  if (!fields.city.trim()) {
    return 'Please enter your city'
  }

  if (!fields.pincode.trim()) {
    return 'Please enter your pincode'
  }

  return null
}

const emptyAddressFields = (): DeliveryAddressFields => ({
  city: '',
  village: '',
  pincode: '',
})

export { emptyAddressFields }
