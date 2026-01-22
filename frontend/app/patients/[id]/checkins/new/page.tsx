'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'
import { Toast } from '@/components/ui/toast'

export default function NewCheckInPage() {
  const { professional, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  const [loading, setLoading] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [patient, setPatient] = useState<any>(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    waist_cm: '',
    hip_cm: '',
    body_fat_pct: '',
    adherence: '',
    observations: '',
    recommendation_template_diet: '',
    recommendation_template_training: '',
    recommendation_template_lifestyle: '',
    next_return_date: '',
  })

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
      const response = await api.get(`/patients/${patientId}`)
      setPatient(response.data)
    } catch (error) {
      console.error('Erro ao buscar paciente:', error)
      router.push('/patients')
    }
  }

  const loadTemplates = async () => {
    if (!patient) return
    
    try {
      setLoadingTemplates(true)
      const response = await api.get(`/templates/defaults/patient/${patientId}`)
      const templates = response.data
      setFormData({
        ...formData,
        recommendation_template_diet: templates.diet,
        recommendation_template_training: templates.training,
        recommendation_template_lifestyle: templates.lifestyle,
      })
      setToast({ message: 'Templates carregados! Personalize conforme necessário.', type: 'info' })
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        weight_kg: parseFloat(formData.weight_kg),
        waist_cm: formData.waist_cm ? parseFloat(formData.waist_cm) : undefined,
        hip_cm: formData.hip_cm ? parseFloat(formData.hip_cm) : undefined,
        body_fat_pct: formData.body_fat_pct ? parseFloat(formData.body_fat_pct) : undefined,
        adherence: formData.adherence || undefined,
        next_return_date: formData.next_return_date ? new Date(formData.next_return_date).toISOString() : undefined,
      }

      await api.post(`/checkins/patients/${patientId}/checkins`, payload)
      setToast({ message: 'Consulta registrada com sucesso!', type: 'success' })
      setTimeout(() => {
        router.push(`/patients/${patientId}`)
      }, 1000)
    } catch (error: any) {
      setToast({
        message: error.response?.data?.detail || 'Erro ao registrar consulta',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={`/patients/${patientId}`} className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Nova Consulta - {patient.full_name}</CardTitle>
            <CardDescription>Registre uma nova consulta de retorno</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button type="button" variant="outline" onClick={loadTemplates} disabled={loadingTemplates}>
                {loadingTemplates ? 'Carregando...' : 'Carregar Templates Padrão'}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Consulta *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Peso (kg) *</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    min="10"
                    max="500"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waist_cm">Cintura (cm)</Label>
                  <Input
                    id="waist_cm"
                    type="number"
                    step="0.1"
                    value={formData.waist_cm}
                    onChange={(e) => setFormData({ ...formData, waist_cm: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hip_cm">Quadril (cm)</Label>
                  <Input
                    id="hip_cm"
                    type="number"
                    step="0.1"
                    value={formData.hip_cm}
                    onChange={(e) => setFormData({ ...formData, hip_cm: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body_fat_pct">% Gordura Corporal</Label>
                  <Input
                    id="body_fat_pct"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.body_fat_pct}
                    onChange={(e) => setFormData({ ...formData, body_fat_pct: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adherence">Adesão</Label>
                  <Select
                    id="adherence"
                    value={formData.adherence}
                    onChange={(e) => setFormData({ ...formData, adherence: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="next_return_date">Próximo Retorno</Label>
                  <Input
                    id="next_return_date"
                    type="date"
                    value={formData.next_return_date}
                    onChange={(e) => setFormData({ ...formData, next_return_date: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Deixe em branco para calcular automaticamente</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observations">Observações</Label>
                  <textarea
                    id="observations"
                    className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recommendation_template_diet">Recomendações - Dieta</Label>
                  <textarea
                    id="recommendation_template_diet"
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.recommendation_template_diet}
                    onChange={(e) => setFormData({ ...formData, recommendation_template_diet: e.target.value })}
                    placeholder="Personalize as recomendações dietéticas..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recommendation_template_training">Recomendações - Treino</Label>
                  <textarea
                    id="recommendation_template_training"
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.recommendation_template_training}
                    onChange={(e) => setFormData({ ...formData, recommendation_template_training: e.target.value })}
                    placeholder="Personalize as recomendações de treino..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recommendation_template_lifestyle">Recomendações - Estilo de Vida</Label>
                  <textarea
                    id="recommendation_template_lifestyle"
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.recommendation_template_lifestyle}
                    onChange={(e) => setFormData({ ...formData, recommendation_template_lifestyle: e.target.value })}
                    placeholder="Personalize as recomendações de estilo de vida..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Consulta'}
                </Button>
                <Link href={`/patients/${patientId}`}>
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

