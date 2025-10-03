"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FleetFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([100, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])

  useEffect(() => {
    const categoriaUrl = searchParams.get("categoria")
    const categorias = searchParams.get("categorias")?.split(",") || []
    const transmissoes = searchParams.get("transmissoes")?.split(",") || []
    const anos = searchParams.get("anos")?.split(",") || []
    const minPreco = searchParams.get("minPreco")
    const maxPreco = searchParams.get("maxPreco")

    if (categoriaUrl && !selectedCategories.includes(categoriaUrl)) {
      setSelectedCategories([categoriaUrl])
    } else if (categorias.length > 0) {
      setSelectedCategories(categorias)
    }

    if (transmissoes.length > 0) {
      setSelectedTransmissions(transmissoes)
    }

    if (anos.length > 0) {
      setSelectedYears(anos)
    }

    if (minPreco && maxPreco) {
      setPriceRange([parseInt(minPreco), parseInt(maxPreco)])
    }
  }, [searchParams])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmissions((prev) =>
      prev.includes(transmission) ? prev.filter((t) => t !== transmission) : [...prev, transmission],
    )
  }

  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set("categorias", selectedCategories.join(","))
    }

    if (selectedTransmissions.length > 0) {
      params.set("transmissoes", selectedTransmissions.join(","))
    }

    if (selectedYears.length > 0) {
      params.set("anos", selectedYears.join(","))
    }

    params.set("minPreco", priceRange[0].toString())
    params.set("maxPreco", priceRange[1].toString())

    router.push(`/frota?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedTransmissions([])
    setSelectedYears([])
    setPriceRange([100, 500])
    router.push("/frota")
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categoria */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Categoria</Label>
          <div className="space-y-2">
            {["SUV", "Sedan", "Hatchback", "Cupê", "Esportivo"].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Preço */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Preço por dia</Label>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} min={50} max={1000} step={10} />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Câmbio */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Câmbio</Label>
          <div className="space-y-2">
            {["Automático", "Manual"].map((transmission) => (
              <div key={transmission} className="flex items-center space-x-2">
                <Checkbox
                  id={transmission}
                  checked={selectedTransmissions.includes(transmission)}
                  onCheckedChange={() => toggleTransmission(transmission)}
                />
                <label htmlFor={transmission} className="text-sm cursor-pointer">
                  {transmission}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Ano */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Ano</Label>
          <div className="space-y-2">
            {["2025", "2024", "2023"].map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox
                  id={year}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => toggleYear(year)}
                />
                <label htmlFor={year} className="text-sm cursor-pointer">
                  {year}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={applyFilters}>
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  )
}
