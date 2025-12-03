import { useState, useEffect } from 'react';
import { Pill, Package, AlertTriangle, TrendingDown, TrendingUp, ShoppingCart, Plus, Edit2, Trash2, Search, Filter, Download } from 'lucide-react';
import { usePharmacy } from '../hooks/useAdvancedDatabase';

export default function PharmacyManagement({ currentUser }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  const { 
    inventory, 
    lowStockItems, 
    expiringItems, 
    loading, 
    createItem, 
    updateItem, 
    deleteItem 
  } = usePharmacy();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Analgésico',
    quantity: 0,
    unit: 'unidades',
    minStock: 10,
    maxStock: 100,
    price: 0,
    expiryDate: '',
    supplier: '',
    location: '',
    batchNumber: '',
    notes: ''
  });

  const categories = [
    'Analgésico',
    'Antibiótico',
    'Antiinflamatorio',
    'Antihipertensivo',
    'Antidiabético',
    'Antihistamínico',
    'Vitaminas',
    'Suplementos',
    'Material Médico',
    'Equipo',
    'Otros'
  ];

  const units = ['unidades', 'cajas', 'frascos', 'ampolletas', 'tabletas', 'ml', 'gr'];

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Agotado', color: 'bg-red-500', textColor: 'text-red-700' };
    if (item.quantity < item.minStock) return { label: 'Stock Bajo', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (item.quantity > item.maxStock) return { label: 'Exceso', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { label: 'Normal', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    if (days === null) return null;
    if (days < 0) return { label: 'Caducado', color: 'bg-red-500', textColor: 'text-red-700' };
    if (days < 30) return { label: `Caduca en ${days} días`, color: 'bg-orange-500', textColor: 'text-orange-700' };
    if (days < 90) return { label: `Caduca en ${days} días`, color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return null;
  };

  const filteredInventory = inventory.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStock === 'low' && item.quantity >= item.minStock) return false;
    if (filterStock === 'out' && item.quantity > 0) return false;
    if (filterStock === 'expiring') {
      const days = getDaysUntilExpiry(item.expiryDate);
      if (!days || days > 90) return false;
    }
    return true;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const handleSaveItem = async () => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Analgésico',
      quantity: item.quantity || 0,
      unit: item.unit || 'unidades',
      minStock: item.minStock || 10,
      maxStock: item.maxStock || 100,
      price: item.price || 0,
      expiryDate: item.expiryDate || '',
      supplier: item.supplier || '',
      location: item.location || '',
      batchNumber: item.batchNumber || '',
      notes: item.notes || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      await deleteItem(id);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Analgésico',
      quantity: 0,
      unit: 'unidades',
      minStock: 10,
      maxStock: 100,
      price: 0,
      expiryDate: '',
      supplier: '',
      location: '',
      batchNumber: '',
      notes: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Categoría', 'Cantidad', 'Unidad', 'Precio', 'Valor Total', 'Fecha Caducidad', 'Lote', 'Ubicación'];
    const rows = filteredInventory.map(item => [
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.price,
      (item.quantity * item.price).toFixed(2),
      item.expiryDate || 'N/A',
      item.batchNumber || 'N/A',
      item.location || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-farmacia-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Pill className="w-10 h-10 text-blue-600" />
            Gestión de Farmacia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Control de inventario y medicamentos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Artículos</p>
                <p className="text-3xl font-bold mt-2">{totalItems}</p>
              </div>
              <Package className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Valor Total</p>
                <p className="text-3xl font-bold mt-2">${totalValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Stock Bajo</p>
                <p className="text-3xl font-bold mt-2">{lowStockItems.length}</p>
              </div>
              <TrendingDown className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Por Caducar</p>
                <p className="text-3xl font-bold mt-2">{expiringItems.length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventario ({filteredInventory.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('low-stock')}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === 'low-stock'
                    ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Stock Bajo ({lowStockItems.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('expiring')}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === 'expiring'
                    ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50/50 dark:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Por Caducar ({expiringItems.length})
                </div>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar medicamento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todo el stock</option>
                <option value="low">Stock bajo</option>
                <option value="out">Agotado</option>
                <option value="expiring">Por caducar</option>
              </select>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Artículo
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Medicamento</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Categoría</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Precio</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Caducidad</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Ubicación</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(activeTab === 'inventory' ? filteredInventory :
                      activeTab === 'low-stock' ? lowStockItems :
                      expiringItems).map(item => {
                      const stockStatus = getStockStatus(item);
                      const expiryStatus = getExpiryStatus(item);
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              {item.batchNumber && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">Lote: {item.batchNumber}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {item.quantity} {item.unit}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Min: {item.minStock} / Max: {item.maxStock}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 ${stockStatus.color} text-white rounded-full text-xs font-medium`}>
                              {stockStatus.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-900 dark:text-white">${item.price}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total: ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            {item.expiryDate ? (
                              <div>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {new Date(item.expiryDate).toLocaleDateString('es-ES')}
                                </p>
                                {expiryStatus && (
                                  <span className={`inline-block mt-1 px-2 py-0.5 ${expiryStatus.color} text-white rounded-full text-xs font-medium`}>
                                    {expiryStatus.label}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-600 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.location || 'N/A'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {(activeTab === 'inventory' ? filteredInventory :
                  activeTab === 'low-stock' ? lowStockItems :
                  expiringItems).length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No se encontraron artículos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Medicamento *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unidad *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Precio Unitario *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Mínimo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Máximo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Caducidad
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Lote
                    </label>
                    <input
                      type="text"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proveedor
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Estante A-3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notas
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveItem}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {editingItem ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
