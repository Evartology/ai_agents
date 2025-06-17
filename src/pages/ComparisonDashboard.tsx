import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Minus, ArrowRight, Filter, RotateCcw } from 'lucide-react';

interface PlatformData {
  platforms: Record<string, any>;
}

const ComparisonDashboard: React.FC = () => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'overview' | 'pricing' | 'features' | 'technical'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/ai_agents_structured_data.json');
        const platformData = await response.json();
        setData(platformData);
        
        // Pre-select first 3 platforms for initial comparison
        const platformKeys = Object.keys(platformData.platforms);
        setSelectedPlatforms(platformKeys.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePlatform = (platformKey: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformKey)) {
        return prev.filter(key => key !== platformKey);
      } else if (prev.length < 4) {
        return [...prev, platformKey];
      }
      return prev;
    });
  };

  const resetComparison = () => {
    setSelectedPlatforms([]);
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

  const platformKeys = Object.keys(data.platforms);

  const renderComparisonValue = (value: any, type: 'boolean' | 'text' | 'price' = 'text') => {
    if (type === 'boolean') {
      return value ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      );
    }
    
    if (type === 'price' && typeof value === 'string') {
      return <span className="font-semibold text-green-600">{value}</span>;
    }
    
    if (!value || value === 'N/A') {
      return <Minus className="h-4 w-4 text-slate-400" />;
    }
    
    return <span className="text-slate-700">{value}</span>;
  };

  const renderOverviewComparison = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold text-slate-800 mb-3">Basic Information</h4>
        <div className="space-y-3">
          {['tagline', 'headquarters', 'founded', 'market_position'].map(field => (
            <div key={field} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100 last:border-b-0">
              <div className="font-medium text-slate-600 capitalize">{field.replace('_', ' ')}</div>
              {selectedPlatforms.map(key => (
                <div key={key} className="text-sm">
                  {renderComparisonValue(data.platforms[key][field])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold text-slate-800 mb-3">Core Features (Top 3)</h4>
        <div className="space-y-3">
          {[0, 1, 2].map(index => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100 last:border-b-0">
              <div className="font-medium text-slate-600">Feature {index + 1}</div>
              {selectedPlatforms.map(key => (
                <div key={key} className="text-sm">
                  {renderComparisonValue(data.platforms[key].core_features?.[index] || 'N/A')}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPricingComparison = () => (
    <div className="space-y-4">
      {selectedPlatforms.map(key => {
        const platform = data.platforms[key];
        const pricing = platform.pricing;
        
        return (
          <div key={key} className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-slate-800 mb-3">{platform.name} Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(pricing).map(([tier, details]: [string, any]) => (
                <div key={tier} className="border border-slate-200 rounded-lg p-4">
                  <h5 className="font-medium text-slate-800 capitalize">{tier.replace('_', ' ')}</h5>
                  <p className="text-lg font-bold text-blue-600 mt-1">{details.price || 'Custom'}</p>
                  {details.credits && (
                    <p className="text-sm text-slate-600 mt-1">{details.credits}</p>
                  )}
                  {details.features && (
                    <ul className="mt-2 space-y-1">
                      {details.features.slice(0, 2).map((feature: string, index: number) => (
                        <li key={index} className="text-xs text-slate-600 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTechnicalComparison = () => (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-semibold text-slate-800 mb-3">Technical Specifications</h4>
      <div className="space-y-3">
        {['runtime_uptime', 'supported_formats', 'api_access'].map(field => (
          <div key={field} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100 last:border-b-0">
            <div className="font-medium text-slate-600 capitalize">{field.replace('_', ' ')}</div>
            {selectedPlatforms.map(key => (
              <div key={key} className="text-sm">
                {data.platforms[key].technical_specs?.[field] ? 
                  Array.isArray(data.platforms[key].technical_specs[field]) 
                    ? data.platforms[key].technical_specs[field].join(', ')
                    : renderComparisonValue(data.platforms[key].technical_specs[field])
                  : renderComparisonValue(null)
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Comparison Dashboard</h1>
        <p className="text-slate-600">Compare AI agents side-by-side to make informed decisions</p>
      </div>

      {/* Platform Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Select Platforms to Compare</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">{selectedPlatforms.length}/4 selected</span>
            <button
              onClick={resetComparison}
              className="flex items-center px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {platformKeys.map(key => {
            const platform = data.platforms[key];
            const isSelected = selectedPlatforms.includes(key);
            
            return (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                disabled={!isSelected && selectedPlatforms.length >= 4}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : selectedPlatforms.length >= 4
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <h3 className="font-medium text-slate-900 text-sm">{platform.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{platform.market_position}</p>
                {isSelected && (
                  <div className="mt-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Mode Selector */}
      {selectedPlatforms.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Comparison Mode</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: Filter },
              { key: 'pricing', label: 'Pricing', icon: Filter },
              { key: 'technical', label: 'Technical', icon: Filter },
            ].map(mode => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.key}
                  onClick={() => setComparisonMode(mode.key as any)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    comparisonMode === mode.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {selectedPlatforms.length > 0 ? (
        <div className="mb-8">
          {/* Platform Headers */}
          <div className="bg-white rounded-t-xl p-4 border border-b-0 border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-semibold text-slate-800">Platform</div>
              {selectedPlatforms.map(key => (
                <div key={key} className="text-center">
                  <Link
                    to={`/agent/${key}`}
                    className="flex items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <span className="font-medium text-slate-900">{data.platforms[key].name}</span>
                    <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Content */}
          <div className="bg-white rounded-b-xl border border-slate-200 p-4">
            {comparisonMode === 'overview' && renderOverviewComparison()}
            {comparisonMode === 'pricing' && renderPricingComparison()}
            {comparisonMode === 'technical' && renderTechnicalComparison()}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Select Platforms to Compare</h3>
          <p className="text-slate-600">Choose up to 4 platforms from the selection above to start comparing</p>
        </div>
      )}

      {/* Quick Actions */}
      {selectedPlatforms.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Need More Details?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/pricing"
              className="flex items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <span>Detailed Pricing Analysis</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              to="/features"
              className="flex items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <span>Complete Features Matrix</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              to="/performance"
              className="flex items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <span>Performance Benchmarks</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonDashboard;
