'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  tier: string | null;
  created_at: string;
}

interface FeatureFlagForm {
  key: string;
  enabled: boolean;
  tier: string;
}

export default function AdminFeatures() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<FeatureFlagForm>({
    key: '',
    enabled: false,
    tier: ''
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
      return;
    }

    if (isAdmin) {
      loadFeatureFlags();
    }
  }, [user, isAdmin, loading, router]);

  const loadFeatureFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeatureFlags(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feature flags');
    } finally {
      setFlagsLoading(false);
    }
  };

  const toggleFlag = async (id: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled: !currentEnabled })
        .eq('id', id);

      if (error) throw error;

      setFeatureFlags(featureFlags?.map(flag =>
        flag?.id === id ? { ...flag, enabled: !currentEnabled } : flag
      ) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle feature flag');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        tier: formData.tier || null
      };

      if (isEditing) {
        const { error } = await supabase
          .from('feature_flags')
          .update(submitData)
          .eq('id', isEditing);

        if (error) throw error;

        setFeatureFlags(featureFlags?.map(flag =>
          flag?.id === isEditing ? { ...flag, ...submitData } : flag
        ) || []);
        
        setIsEditing(null);
      } else {
        const { data, error } = await supabase
          .from('feature_flags')
          .insert(submitData)
          .select()
          .single();

        if (error) throw error;
        setFeatureFlags([data, ...featureFlags]);
        setIsAdding(false);
      }

      setFormData({
        key: '',
        enabled: false,
        tier: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save feature flag');
    }
  };

  const handleEdit = (flag: FeatureFlag) => {
    setFormData({
      key: flag.key,
      enabled: flag.enabled,
      tier: flag.tier || ''
    });
    setIsEditing(flag.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFeatureFlags(featureFlags?.filter(flag => flag?.id !== id) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feature flag');
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      enabled: false,
      tier: ''
    });
    setIsEditing(null);
    setIsAdding(false);
  };

  if (loading || flagsLoading) {
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
                  Feature Flags Management
                </h3>
                {!isAdding && !isEditing && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Flag
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
                    {isEditing ? 'Edit Feature Flag' : 'Add New Feature Flag'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                      <input
                        type="text"
                        required
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g., enhanced_processing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tier (Optional)</label>
                      <input
                        type="text"
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g., Pro, Enterprise"
                      />
                    </div>

                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id="enabled"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                        Enabled
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
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
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
                    {featureFlags?.map((flag) => (
                      <tr key={flag?.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {flag?.key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flag?.tier || 'All'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleFlag(flag?.id, flag?.enabled)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              flag?.enabled 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' :'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {flag?.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(flag)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(flag?.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {featureFlags?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No feature flags found
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