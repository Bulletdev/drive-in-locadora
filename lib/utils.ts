import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Form masks and helpers
export function onlyDigits(value: string, maxLength?: number) {
  const digits = value.replace(/\D/g, '')
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits
}

export function maskCpf(value: string) {
  const digits = onlyDigits(value, 11)
  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 9)
  const part4 = digits.slice(9, 11)
  let out = ''
  if (part1) out = part1
  if (part2) out += `.${part2}`
  if (part3) out += `.${part3}`
  if (part4) out += `-${part4}`
  return out
}

export function maskCep(value: string) {
  const digits = onlyDigits(value, 8)
  const part1 = digits.slice(0, 5)
  const part2 = digits.slice(5, 8)
  return part2 ? `${part1}-${part2}` : part1
}

export function maskPhoneBR(value: string) {
  const digits = onlyDigits(value, 11)
  const ddd = digits.slice(0, 2)
  const middle = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6)
  const last = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10)
  if (!ddd) return digits
  if (!middle) return `(${ddd}`
  if (!last) return `(${ddd}) ${middle}`
  return `(${ddd}) ${middle}-${last}`
}

export function maskStateUF(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
}

// Vehicle slug helper: "Toyota Corolla" + 2024 -> "toyota-corolla-2024"
export function slugifyVehicle(name: string, year: number): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // drop non-alphanum except spaces/hyphens
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${base}-${year}`
}
