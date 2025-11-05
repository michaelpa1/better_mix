'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

interface PricingTier {
  id: string;
  name: string;
  per_min_credit_cost: number;
  preview_free: boolean;
  active: boolean;
  created_at: string;
}

interface PricingTierForm {
  name: string;
  per_min_credit_cost: number;
  preview_free: boolean;
  active: boolean;
}

export default function AdminPricing() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<PricingTierForm>({
    name: '',
    per_min_credit_cost: 1,
    preview_free: true,
    active: true
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
      return;
    }

    if (isAdmin) {
      loadPricingTiers();
    }
  }, [user, isAdmin, loading, router]);

  const loadPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPricingTiers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing tiers');
    } finally {
      setTiersLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('pricing_tiers')
          .update(formData)
          .eq('id', isEditing);

        if (error) throw error;

        setPricingTiers(pricingTiers?.map(tier =>
          tier?.id === isEditing ? { ...tier, ...formData } : tier
        ) || []);
        
        setIsEditing(null);
      } else {
        const { data, error } = await supabase
          .from('pricing_tiers')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;
        setPricingTiers([data, ...pricingTiers]);
        setIsAdding(false);
      }

      setFormData({
        name: '',
        per_min_credit_cost: 1,
        preview_free: true,
        active: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pricing tier');
    }
  };

  const handleEdit = (tier: PricingTier) => {
    setFormData({
      name: tier.name,
      per_min_credit_cost: tier.per_min_credit_cost,
      preview_free: tier.preview_free,
      active: tier.active
    });
    setIsEditing(tier.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing tier?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pricing_tiers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPricingTiers(pricingTiers?.filter(tier => tier?.id !== id) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pricing tier');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      per_min_credit_cost: 1,
      preview_free: true,
      active: true
    });
    setIsEditing(null);
    setIsAdding(false);
  };

  if (loading || tiersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Pricing Tiers Management
                </h3>
                {!isAdding && !isEditing && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Tier
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {(isAdding || isEditing) && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {isEditing ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g., Pro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Credit Cost per Minute</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.per_min_credit_cost}
                        onChange={(e) => setFormData({ ...formData, per_min_credit_cost: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preview_free"
                        checked={formData.preview_free}
                        onChange={(e) => setFormData({ ...formData, preview_free: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="preview_free" className="ml-2 block text-sm text-gray-900">
                        Preview Free
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {isEditing ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost per Minute
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview Free
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pricingTiers?.map((tier) => (
                      <tr key={tier?.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tier?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tier?.per_min_credit_cost} credits
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tier?.preview_free 
                              ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                          }`}>
                            {tier?.preview_free ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tier?.active 
                              ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                          }`}>
                            {tier?.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(tier)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tier?.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pricingTiers?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No pricing tiers found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}