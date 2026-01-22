'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewPatientPage() {
  const { professional } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    sex: '',
    height_cm: '',
    activity_level: '',
    goal: '',
    notes: '',
    cpf: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        birth_date: new Date(formData.birth_date).toISOString(),
        height_cm: parseFloat(formData.height_cm),
        cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : undefined,
      }

      await api.post('/patients', payload)
      setToast({ message: 'Paciente cadastrado com sucesso!', type: 'success' })
      setTimeout(() => {
        router.push('/patients')
      }, 1000)
    } catch (error: any) {
      setToast({
        message: error.response?.data?.detail || 'Erro ao cadastrar paciente',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/patients" className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Novo Paciente</CardTitle>
            <CardDescription>Cadastre um novo paciente no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo *</Label>
                  <Select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height_cm">Altura (cm) *</Label>
                  <Input
                    id="height_cm"
                    type="number"
                    step="0.1"
                    min="50"
                    max="300"
                    value={formData.height_cm}
                    onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_level">Nível de Atividade *</Label>
                  <Select
                    id="activity_level"
                    value={formData.activity_level}
                    onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="sedentário">Sedentário</option>
                    <option value="leve">Leve</option>
                    <option value="moderado">Moderado</option>
                    <option value="alto">Alto</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Objetivo *</Label>
                  <Select
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="manutenção">Manutenção</option>
                    <option value="saúde geral">Saúde Geral</option>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cpf">CPF (opcional)</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value)
                      setFormData({ ...formData, cpf: formatted })
                    }}
                    maxLength={14}
                  />
                  <p className="text-xs text-gray-500">CPF será armazenado de forma segura e criptografada</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Paciente'}
                </Button>
                <Link href="/patients">
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

