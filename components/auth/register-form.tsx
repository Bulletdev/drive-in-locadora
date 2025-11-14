"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { apiRegister } from "@/lib/api-client"
import { maskCep, maskCpf, maskPhoneBR, onlyDigits, maskStateUF } from "@/lib/utils"

export function RegisterForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    // Endereço
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
    addressCep: "",
    // CNH
    birthDate: "",
    cnhNumber: "",
    cnhExpiry: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!")
      return
    }

    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os termos de uso!")
      return
    }

    // Validações adicionais para locadora (concessionária)
    // Endereço obrigatório: rua, número, cidade, estado, CEP
    const requiredAddress = [
      formData.addressStreet,
      formData.addressNumber,
      formData.addressCity,
      formData.addressState,
      formData.addressCep,
    ]
    if (requiredAddress.some((f) => !String(f).trim())) {
      setError("Preencha os campos de endereço obrigatórios (Rua, Número, Cidade, Estado, CEP).")
      return
    }

    // Data de nascimento (mínimo 21 anos)
    const today = new Date()
    const dob = formData.birthDate ? new Date(formData.birthDate) : null
    if (!dob || Number.isNaN(dob.getTime())) {
      setError("Informe sua data de nascimento válida.")
      return
    }
    const hadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
    const age = today.getFullYear() - dob.getFullYear() - (hadBirthdayThisYear ? 0 : 1)
    if (age < 21) {
      setError("É necessário ter pelo menos 21 anos para reservar.")
      return
    }

    // CNH: número e validade futura
    if (!String(formData.cnhNumber).trim()) {
      setError("Informe o número da CNH.")
      return
    }
    const cnhExp = formData.cnhExpiry ? new Date(formData.cnhExpiry) : null
    if (!cnhExp || Number.isNaN(cnhExp.getTime()) || cnhExp <= today) {
      setError("Informe uma validade de CNH futura e válida.")
      return
    }

    setIsSubmitting(true)

    try {
      // Criar conta via API externa
      const registerResult = await apiRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        password: formData.password,
        // Endereço
        addressStreet: formData.addressStreet,
        addressNumber: formData.addressNumber,
        addressComplement: formData.addressComplement || "",
        addressNeighborhood: formData.addressNeighborhood || "",
        addressCity: formData.addressCity,
        addressState: formData.addressState,
        addressCep: formData.addressCep,
        // CNH
        birthDate: formData.birthDate,
        cnhNumber: formData.cnhNumber,
        cnhExpiry: formData.cnhExpiry,
        cnhCategory: formData.cnhCategory || undefined, undefined,
      })

      if (!registerResult.success) {
        setError(registerResult.error || "Erro ao criar conta")
        setIsSubmitting(false)
        return
      }

      // Login automático após cadastro
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Conta criada, mas erro ao fazer login. Tente fazer login manualmente.")
        setIsSubmitting(false)
        return
      }

      // Usar window.location para garantir reload completo e evitar problemas com RSC
      window.location.href = "/area-cliente"
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setError("Erro ao criar conta. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: maskPhoneBR(e.target.value) })}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: maskCpf(e.target.value) })}
                required
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {/* Endereço */}
          <div className="pt-2">
            <h2 className="text-sm font-semibold mb-2">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="addressStreet">Rua</Label>
                <Input
                  id="addressStreet"
                  value={formData.addressStreet}
                  onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                  required
                  placeholder="Rua/Avenida"
                />
              </div>
              <div>
                <Label htmlFor="addressNumber">Número</Label>
                <Input
                  id="addressNumber"
                  value={formData.addressNumber}
                  onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                  required
                  placeholder="123"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="addressNeighborhood">Bairro</Label>
                <Input
                  id="addressNeighborhood"
                  value={formData.addressNeighborhood}
                  onChange={(e) => setFormData({ ...formData, addressNeighborhood: e.target.value })}
                  placeholder="Bairro"
                />
              </div>
              <div>
                <Label htmlFor="addressCity">Cidade</Label>
                <Input
                  id="addressCity"
                  value={formData.addressCity}
                  onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                  required
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="addressState">Estado</Label>
                <Input
                  id="addressState"
                  value={formData.addressState}
                  onChange={(e) => setFormData({ ...formData, addressState: maskStateUF(e.target.value) })}
                  required
                  placeholder="SP"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="addressCep">CEP</Label>
                <Input
                  id="addressCep"
                  value={formData.addressCep}
                  onChange={(e) => setFormData({ ...formData, addressCep: maskCep(e.target.value) })}
                  required
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressComplement">Complemento</Label>
                <Input
                  id="addressComplement"
                  value={formData.addressComplement}
                  onChange={(e) => setFormData({ ...formData, addressComplement: e.target.value })}
                  placeholder="Apto, bloco, referência"
                />
              </div>
            </div>
          </div>

          {/* CNH e elegibilidade */}
          <div className="pt-2">
            <h2 className="text-sm font-semibold mb-2">Informações de CNH</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnhNumber">Número da CNH</Label>
                <Input
                  id="cnhNumber"
                  value={formData.cnhNumber}
                  onChange={(e) => setFormData({ ...formData, cnhNumber: onlyDigits(e.target.value, 11) })}
                  required
                  placeholder="00000000000"
                />
              </div>
              <div>
                <Label htmlFor="cnhExpiry">Validade da CNH</Label>
                <Input
                  id="cnhExpiry"
                  type="date"
                  value={formData.cnhExpiry}
                  onChange={(e) => setFormData({ ...formData, cnhExpiry: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Aceito os termos de uso e política de privacidade
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
