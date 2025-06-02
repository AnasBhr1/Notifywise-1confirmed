import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function generateInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function getAppointmentStatusColor(status: string): string {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'no-show':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getMessageStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'sent':
      return 'bg-blue-100 text-blue-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'read':
      return 'bg-purple-100 text-purple-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function calculateDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) {
    return `${diffMins}min`
  }
  
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  
  if (mins === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${mins}min`
}

export function getTimeSlots(startHour: number = 9, endHour: number = 17, intervalMinutes: number = 30): string[] {
  const slots: string[] = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = new Date()
      time.setHours(hour, minute, 0, 0)
      
      slots.push(time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }))
    }
  }
  
  return slots
}

export function isBusinessHours(date: Date, businessHours: any): boolean {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const hours = businessHours[dayOfWeek]
  
  if (!hours || !hours.isOpen) return false
  
  const currentTime = date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  return currentTime >= hours.open && currentTime <= hours.close
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export function generateBookingUrl(businessId: string, baseUrl: string = window.location.origin): string {
  return `${baseUrl}/book/${businessId}`
}

export function generateQRCodeUrl(text: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
}