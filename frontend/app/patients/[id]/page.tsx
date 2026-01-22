'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, TrendingUp, Calendar, User } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'
import { formatDate, formatDateTime } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PatientDetail {
  id: string
  full_name: string
  birth_date: string
  sex: string
  height_cm: number
  activity_level: string
  goal: string
  notes: string | null
  cpf_masked: string | null
  created_at: string
  updated_at: string
  checkins: CheckIn[]
}

interface CheckIn {
  id: string
  date: string
  weight_kg: number
  waist_cm: number | null
  hip_cm: number | null
  body_fat_pct: number | null
  adherence: string | null
  observations: string | null
  imc: number
  recommendation_template_diet: string | null
  recommendation_template_training: string | null
  recommendation_template_lifestyle: string | null
  next_return_date: string | null
  created_at: string
}

export default function PatientDetailPage() {
  const { professional, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<PatientDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !professional) {
      router.push('/login')
    }
  }, [professional, authLoading, router])

  useEffect(() => {
    if (professional && patientId) {
      fetchPatient()
    }
  }, [professional, patientId])

  const fetchPatient = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/patients/${patientId}`)
      setPatient(response.data)
    } catch (error) {
      console.error('Erro ao buscar paciente:', error)
      router.push('/patients')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const chartData = patient?.checkins
    .map(c => ({
      date: formatDate(c.date),
      imc: c.imc,
      peso: c.weight_kg,
    }))
    .reverse() || []

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  const currentImc = patient.checkins.length > 0
    ? patient.checkins[0].imc
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/patients" className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.full_name}</h1>
            <p className="text-gray-500 capitalize">{patient.goal}</p>
          </div>
          <Link href={`/patients/${patientId}/checkins/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Idade:</span>
                <span>{calculateAge(patient.birth_date)} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sexo:</span>
                <span className="capitalize">{patient.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Altura:</span>
                <span>{patient.height_cm} cm</span>
              </div>
              {patient.cpf_masked && (
                <div className="flex justify-between">
                  <span className="text-gray-500">CPF:</span>
                  <span>{patient.cpf_masked}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objetivo e Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Objetivo:</span>
                <span className="capitalize">{patient.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nível de atividade:</span>
                <span className="capitalize">{patient.activity_level}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">IMC Atual</CardTitle>
            </CardHeader>
            <CardContent>
              {currentImc ? (
                <div className="text-3xl font-bold text-primary-600">{currentImc.toFixed(1)}</div>
              ) : (
                <p className="text-gray-500">Nenhuma consulta registrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        {patient.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{patient.notes}</p>
            </CardContent>
          </Card>
        )}

        {chartData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução (IMC e Peso)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="imc" stroke="#22c55e" strokeWidth={2} name="IMC" />
                  <Line yAxisId="right" type="monotone" dataKey="peso" stroke="#0ea5e9" strokeWidth={2} name="Peso (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Histórico de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient.checkins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma consulta registrada ainda.</p>
                <Link href={`/patients/${patientId}/checkins/new`} className="mt-4 inline-block">
                  <Button>Registrar primeira consulta</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {patient.checkins.map((checkin) => (
                  <div key={checkin.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{formatDate(checkin.date)}</h3>
                        <p className="text-sm text-gray-500">{formatDateTime(checkin.date)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">IMC: {checkin.imc.toFixed(1)}</div>
                        <div className="text-sm text-gray-500">Peso: {checkin.weight_kg} kg</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      {checkin.waist_cm && (
                        <div>
                          <span className="text-gray-500">Cintura:</span>
                          <span className="ml-2 font-medium">{checkin.waist_cm} cm</span>
                        </div>
                      )}
                      {checkin.hip_cm && (
                        <div>
                          <span className="text-gray-500">Quadril:</span>
                          <span className="ml-2 font-medium">{checkin.hip_cm} cm</span>
                        </div>
                      )}
                      {checkin.body_fat_pct && (
                        <div>
                          <span className="text-gray-500">Gordura:</span>
                          <span className="ml-2 font-medium">{checkin.body_fat_pct}%</span>
                        </div>
                      )}
                      {checkin.adherence && (
                        <div>
                          <span className="text-gray-500">Adesão:</span>
                          <span className="ml-2 font-medium capitalize">{checkin.adherence}</span>
                        </div>
                      )}
                    </div>

                    {checkin.observations && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{checkin.observations}</p>
                      </div>
                    )}

                    {checkin.next_return_date && (
                      <div className="text-sm text-gray-600">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Próximo retorno: {formatDate(checkin.next_return_date)}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Link href={`/checkins/${checkin.id}/edit`}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

