'use client';

import { useState } from 'react';
import Card from "../components/CardProduct/CardProduct";
import { IProduct } from "../interfaces/product.interface";

interface StoreClientProps {
  initialProducts: IProduct[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
  const [products] = useState<IProduct[]>(initialProducts);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.categoryId)));

  // Aplicar filtros
  const filteredProducts = products
    .filter(product => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
      return matchesPrice && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const resetFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategory(null);
    setSortBy('name');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* Botón para mostrar filtros en mobile */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between"
            >
              <span className="font-medium">Filtros</span>
              <svg className={`w-5 h-5 transform transition ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Sidebar de filtros */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1 mb-8 lg:mb-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar
                </button>
              </div>

              {/* Filtro por categoría */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categoría</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Todas</span>
                  </label>
                  {categories.map(catId => (
                    <label key={catId} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === catId}
                        onChange={() => setSelectedCategory(catId)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Categoría {catId}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por precio */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rango de precio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600">Mínimo: ${priceRange[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Máximo: ${priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Ordenar por */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Ordenar por</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="name">Nombre (A-Z)</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            {/* Contador de resultados */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{filteredProducts.length}</span> de <span className="font-semibold">{products.length}</span> productos
              </p>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No se encontraron productos con los filtros seleccionados</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
