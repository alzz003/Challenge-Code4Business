'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el Modal del formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');

  // Estado para las evaluaciones
  const [evaluations, setEvaluations] = useState({});

  const API_URL = 'http://localhost:3001/sales';

  useEffect(() => {
    fetchSales();
  },[]);

  const fetchSales = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar las ventas');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateSale = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación manual para asegurarnos que el monto sea positivo, ya que el input de tipo number puede no ser positivo
    if (amount <= 0) {
      setError("Error: El monto no puede ser 0 o negativo. Queremos ganar plata!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, product, amount: Number(amount) }),
      });

      if (!res.ok) throw new Error('Error al crear la venta');
      
      // Limpiamos y cerramos modal
      setCustomer('');
      setProduct('');
      setAmount('');
      setIsModalOpen(false); 
      fetchSales();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (id) => {
    const score = evaluations[id];
    if (!score || score < 1 || score > 5) {
      alert('Por favor selecciona un score del 1 al 5');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: Number(score) }),
      });

      if (!res.ok) throw new Error('Error al evaluar');
      fetchSales();
    } catch (err) {
      alert(err.message);
    }
  };

  const averageScore = sales.filter(s => s.score !== null).length > 0
    ? (sales.filter(s => s.score !== null).reduce((acc, curr) => acc + curr.score, 0) / sales.filter(s => s.score !== null).length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header con botón para abrir Modal */}
        <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Ventas</h1>
            <p className="text-gray-400 mt-1">Gestión y evaluación de operaciones</p>
          </div>
          <div className="text-right flex items-center gap-6">
            <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Score Promedio</p>
                <p className="text-2xl font-bold text-indigo-400">⭐⭐⭐ {averageScore}</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium shadow-lg"
            >
              + Nueva Venta
            </button>
          </div>
        </div>

        {/* Mensaje de error general (fuera del modal) */}
        {error && !isModalOpen && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Listado de Ventas (Tabla) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Listado de Ventas</h2>
          {sales.length === 0 ? (
             <p className="text-gray-500 text-center py-8">No hay ventas registradas aún. ¡Agrega la primera!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-700/50 text-gray-300 border-b border-gray-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Monto</th>
                    <th className="p-3 text-center">Evaluación (1-5)</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <td className="p-3 text-gray-400">#{sale.id}</td>
                      <td className="p-3 font-medium text-gray-200">{sale.customer}</td>
                      <td className="p-3 text-gray-400">{sale.product}</td>
                      <td className="p-3 text-gray-400">${sale.amount}</td>
                      <td className="p-3 text-center">
                        {sale.score !== null ? (
                          <span className="inline-flex items-center justify-center bg-green-900/50 text-green-400 px-3 py-1 rounded-full font-semibold border border-green-800">
                            {sale.score} / 5
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <select 
                              className="bg-gray-700 border border-gray-600 rounded p-1 text-white outline-none focus:border-indigo-500"
                              value={evaluations[sale.id] || ''}
                              onChange={(e) => setEvaluations({...evaluations,[sale.id]: e.target.value})}
                            >
                              <option value="" disabled>-</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <button 
                              onClick={() => handleEvaluate(sale.id)}
                              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm transition">
                              Evaluar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Pantalla para Crear Venta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-200">Registrar Nueva Venta</h2>
              <button 
                onClick={() => {setIsModalOpen(false); setError(null);}} 
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cliente</label>
                <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Producto</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Laptop" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Monto ($)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required step="any"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => {setIsModalOpen(false); setError(null);}}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 font-medium">
                  {loading ? 'Guardando...' : 'Crear Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}