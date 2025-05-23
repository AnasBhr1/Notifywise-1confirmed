"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

interface User {
  id: string
  email: string
  businessName: string
  role: string
}

interface Business {
  _id: string
  name: string
  whatsappNumber: string
  services: string[]
  // Add other business fields as needed
}

interface AuthContextType {
  user: User | null
  business: Business | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, businessName: string, whatsappNumber?: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
axios.defaults.withCredentials = true

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setUser(response.data.data.user)
        setBusiness(response.data.data.business)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { user, business, token } = response.data.data
        setUser(user)
        setBusiness(business)
        Cookies.set('token', token, { expires: 7 }) // 7 days
        router.push('/dashboard')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (email: string, password: string, businessName: string, whatsappNumber?: string) => {
    try {
      const response = await axios.post('/auth/register', {
        email,
        password,
        businessName,
        whatsappSenderId: whatsappNumber // Backend expects 'whatsappSenderId'
      })
      
      if (response.data.success) {
        const { user, business, token } = response.data.data
        setUser(user)
        setBusiness(business)
        Cookies.set('token', token, { expires: 7 }) // 7 days
        router.push('/dashboard')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    setBusiness(null)
    Cookies.remove('token')
    router.push('/')
  }

  const value = {
    user,
    business,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}