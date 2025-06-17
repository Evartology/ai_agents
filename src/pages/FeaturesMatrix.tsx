import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Minus, Filter, Search } from 'lucide-react';

interface PlatformData {
  platforms: Record<string, any>;
}

const FeaturesMatrix: React.FC = () => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'core' | 'technical' | 'pricing'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/ai_agents_structured_data.json`);
        const platformData = await response.json();
        setData(platformData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAllFeatures = () => {
    if (!data) return [];
    
    const allFeatures = new Set<string>();
    Object.values(data.platforms).forEach((platform: any) => {
      platform.core_features?.forEach((feature: string) => allFeatures.add(feature));
      platform.strengths?.forEach((strength: string) => allFeatures.add(strength));
      if (platform.technical_specs) {
        Object.keys(platform.technical_specs).forEach(spec => allFeatures.add(spec.replace('_', ' ')));
      }
    });
    
    return Array.from(allFeatures).sort();
  };

  const hasFeature = (platform: any, feature: string) => {
    const lowerFeature = feature.toLowerCase();
    const lowerPlatformFeatures = [
      ...(platform.core_features || []),
      ...(platform.strengths || []),
      ...Object.keys(platform.technical_specs || {})
    ].map(f => f.toLowerCase().replace('_', ' '));
    
    return lowerPlatformFeatures.some(pf => 
      pf.includes(lowerFeature) || lowerFeature.includes(pf)
    );
  };

  const renderFeatureValue = (platform: any, feature: string) => {
    if (hasFeature(platform, feature)) {
      return <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />;
    }
    return <Minus className="h-4 w-4 text-slate-400 mx-auto" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Failed to load data. Please try again later.</p>
      </div>
    );
  }

  const platforms = Object.entries(data.platforms);
  const allFeatures = getAllFeatures();
  const filteredFeatures = allFeatures.filter(feature => 
    feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Features Comparison Matrix</h1>
        <p className="text-slate-600">Comprehensive feature analysis across all AI agent platforms</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Features</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Features</option>
              <option value="core">Core Features</option>
              <option value="technical">Technical Specs</option>
              <option value="pricing">Pricing Features</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feature Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 sticky left-0 bg-slate-50 z-10">
                  Feature
                </th>
                {platforms.map(([key, platform]) => (
                  <th key={key} className="px-4 py-4 text-center text-sm font-semibold text-slate-900 min-w-32">
                    {platform.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFeatures.map((feature, index) => (
                <tr key={feature} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 sticky left-0 bg-inherit z-10 border-r border-slate-200">
                    {feature}
                  </td>
                  {platforms.map(([key, platform]) => (
                    <td key={key} className="px-4 py-4 text-center">
                      {renderFeatureValue(platform, feature)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border border-slate-200 mt-4">
          <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No features found matching your search criteria.</p>
        </div>
      )}

      {/* Feature Categories */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(([key, platform]) => (
          <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{platform.name}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Core Features</h4>
                <div className="space-y-1">
                  {platform.core_features?.slice(0, 5).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Key Strengths</h4>
                <div className="space-y-1">
                  {platform.strengths?.slice(0, 3).map((strength: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="h-3 w-3 text-blue-500 mr-2" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesMatrix;
