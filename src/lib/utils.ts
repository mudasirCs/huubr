import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

export function formatTime(time: string) {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-IE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}