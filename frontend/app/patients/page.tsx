'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Plus, ArrowLeft, User } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Patient {
  id: string
  full_name: string
  goal: string
  activity_level: string
  created_at: string
  last_checkin_date: string | null
  current_imc: number | null
}

export default function PatientsPage() {
  const { professional, loading: authLoading } = useAuth()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('')
  const [activityFilter, setActivityFilter] = useState('')

  useEffect(() => {
    if (!authLoading && !professional) {
      router.push('/login')
    }
  }, [professional, authLoading, router])

  useEffect(() => {
    if (professional) {
      fetchPatients()
    }
  }, [professional, search, goalFilter, activityFilter])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (goalFilter) params.append('goal', goalFilter)
      if (activityFilter) params.append('activity_level', activityFilter)

      const response = await api.get(`/patients?${params.toString()}`)
      setPatients(response.data)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    } finally {
      setLoading(false)
    }
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
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
            <Link href="/patients/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)}>
              <option value="">Todos os objetivos</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="manutenção">Manutenção</option>
              <option value="saúde geral">Saúde Geral</option>
            </Select>
            <Select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
              <option value="">Todos os níveis</option>
              <option value="sedentário">Sedentário</option>
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="alto">Alto</option>
            </Select>
          </div>
        </div>

        {patients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum paciente encontrado.</p>
              <Link href="/patients/new" className="mt-4 inline-block">
                <Button>Adicionar primeiro paciente</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.full_name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{patient.goal}</p>
                      </div>
                      <div className="rounded-full bg-primary-100 p-2">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nível de atividade:</span>
                        <span className="capitalize">{patient.activity_level}</span>
                      </div>
                      {patient.current_imc && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">IMC atual:</span>
                          <span className="font-medium">{patient.current_imc.toFixed(1)}</span>
                        </div>
                      )}
                      {patient.last_checkin_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Última consulta:</span>
                          <span>{formatDate(patient.last_checkin_date)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cadastrado em:</span>
                        <span>{formatDate(patient.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

