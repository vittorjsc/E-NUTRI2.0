'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, TrendingUp, LogOut, Plus } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'

interface DashboardStats {
  total_patients: number
  upcoming_returns: number
  recent_checkins: number
}

export default function DashboardPage() {
  const { professional, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    total_patients: 0,
    upcoming_returns: 0,
    recent_checkins: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !professional) {
      router.push('/login')
    }
  }, [professional, authLoading, router])

  useEffect(() => {
    if (professional) {
      fetchStats()
    }
  }, [professional])

  const fetchStats = async () => {
    try {
      const [patientsRes, checkinsRes] = await Promise.all([
        api.get('/patients?limit=1000'),
        api.get('/checkins?limit=1000'),
      ])

      const patients = patientsRes.data
      const checkins = checkinsRes.data

      const now = new Date()
      const upcoming = checkins.filter((c: any) => {
        if (!c.next_return_date) return false
        const returnDate = new Date(c.next_return_date)
        return returnDate >= now && returnDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      })

      setStats({
        total_patients: patients.length,
        upcoming_returns: upcoming.length,
        recent_checkins: checkins.filter((c: any) => {
          const date = new Date(c.date)
          const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 30
        }).length,
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">E-Nutri</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{professional?.name}</span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <Link href="/patients/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_patients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retornos Próximos</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming_returns}</div>
              <p className="text-xs text-gray-500 mt-1">Próximos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Recentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent_checkins}</div>
              <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Link href="/patients" className="flex-1">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Gerenciar Pacientes</CardTitle>
                <CardDescription>Visualize e gerencie todos os seus pacientes</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

