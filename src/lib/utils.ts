import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomIntFromInterval(min: number, max: number): number {
  if (min >= max) {
    throw new Error('Invalid range. The min value must be smaller than the max value.')
  }

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

export function getCookie(cname: string) {
  if (window.document) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
  }
  return ''
}
