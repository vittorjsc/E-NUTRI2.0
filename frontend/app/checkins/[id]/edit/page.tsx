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

export default function EditCheckInPage() {
  const { professional, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const checkinId = params.id as string
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [formData, setFormData] = useState({
    date: '',
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
    if (professional && checkinId) {
      fetchCheckIn()
    }
  }, [professional, checkinId])

  const fetchCheckIn = async () => {
    try {
      setLoadingData(true)
      const response = await api.get(`/checkins/${checkinId}`)
      const checkin = response.data
      
      setFormData({
        date: checkin.date.split('T')[0],
        weight_kg: checkin.weight_kg.toString(),
        waist_cm: checkin.waist_cm?.toString() || '',
        hip_cm: checkin.hip_cm?.toString() || '',
        body_fat_pct: checkin.body_fat_pct?.toString() || '',
        adherence: checkin.adherence || '',
        observations: checkin.observations || '',
        recommendation_template_diet: checkin.recommendation_template_diet || '',
        recommendation_template_training: checkin.recommendation_template_training || '',
        recommendation_template_lifestyle: checkin.recommendation_template_lifestyle || '',
        next_return_date: checkin.next_return_date ? checkin.next_return_date.split('T')[0] : '',
      })
    } catch (error) {
      console.error('Erro ao buscar consulta:', error)
      setToast({ message: 'Erro ao carregar consulta', type: 'error' })
      router.push('/patients')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        date: new Date(formData.date).toISOString(),
        weight_kg: parseFloat(formData.weight_kg),
        waist_cm: formData.waist_cm ? parseFloat(formData.waist_cm) : undefined,
        hip_cm: formData.hip_cm ? parseFloat(formData.hip_cm) : undefined,
        body_fat_pct: formData.body_fat_pct ? parseFloat(formData.body_fat_pct) : undefined,
        adherence: formData.adherence || undefined,
        next_return_date: formData.next_return_date ? new Date(formData.next_return_date).toISOString() : undefined,
        observations: formData.observations || undefined,
        recommendation_template_diet: formData.recommendation_template_diet || undefined,
        recommendation_template_training: formData.recommendation_template_training || undefined,
        recommendation_template_lifestyle: formData.recommendation_template_lifestyle || undefined,
      }

      await api.put(`/checkins/${checkinId}`, payload)
      setToast({ message: 'Consulta atualizada com sucesso!', type: 'success' })
      setTimeout(() => {
        router.back()
      }, 1000)
    } catch (error: any) {
      setToast({
        message: error.response?.data?.detail || 'Erro ao atualizar consulta',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loadingData) {
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
            <button
              onClick={() => router.back()}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Consulta</CardTitle>
            <CardDescription>Atualize os dados da consulta</CardDescription>
          </CardHeader>
          <CardContent>
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
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recommendation_template_training">Recomendações - Treino</Label>
                  <textarea
                    id="recommendation_template_training"
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.recommendation_template_training}
                    onChange={(e) => setFormData({ ...formData, recommendation_template_training: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recommendation_template_lifestyle">Recomendações - Estilo de Vida</Label>
                  <textarea
                    id="recommendation_template_lifestyle"
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.recommendation_template_lifestyle}
                    onChange={(e) => setFormData({ ...formData, recommendation_template_lifestyle: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
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

