import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, MapPin, Calendar, Users, Zap, DollarSign, CheckCircle, XCircle, ArrowLeft, TrendingUp, Award } from 'lucide-react';

interface PlatformData {
  platforms: Record<string, any>;
}

const AgentProfile: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'features' | 'performance'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/ai_agents_structured_data.json');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !agentId || !data.platforms[agentId]) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Platform not found. Please check the URL or go back to the comparison page.</p>
        <Link to="/" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  const platform = data.platforms[agentId];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <div className="text-sm text-slate-600">Headquarters</div>
              <div className="font-medium">{platform.headquarters}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <div className="text-sm text-slate-600">Founded</div>
              <div className="font-medium">{platform.founded}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <div className="text-sm text-slate-600">Company Stage</div>
              <div className="font-medium">{platform.company_stage}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <div className="text-sm text-slate-600">Market Position</div>
              <div className="font-medium">{platform.market_position}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {platform.core_features?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-slate-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Strengths</h3>
          <div className="space-y-2">
            {platform.strengths?.map((strength: string, index: number) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-slate-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Considerations</h3>
          <div className="space-y-2">
            {platform.weaknesses?.map((weakness: string, index: number) => (
              <div key={index} className="flex items-center">
                <XCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-slate-700">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      {platform.recent_updates && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {Object.entries(platform.recent_updates).map(([key, update]) => (
              <div key={key} className="flex items-center p-3 bg-slate-50 rounded-lg">
                <Zap className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-slate-700">{String(update)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(platform.pricing).map(([tier, details]: [string, any]) => (
          <div key={tier} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 capitalize mb-2">
                {tier.replace('_', ' ')}
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {details.price || 'Custom'}
              </div>
              {details.credits && (
                <div className="text-sm text-slate-600 mb-4">{details.credits}</div>
              )}
              {details.features && (
                <ul className="text-left space-y-2 mt-4">
                  {details.features.map((feature: string, index: number) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      {/* Technical Specs */}
      {platform.technical_specs && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(platform.technical_specs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-sm text-slate-600">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {platform.performance_metrics && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(platform.performance_metrics).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-sm text-slate-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Target Audience</h3>
        <div className="flex flex-wrap gap-2">
          {platform.target_audience?.map((audience: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {audience}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link 
          to="/comparison" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Comparison
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{platform.name}</h1>
            <p className="text-blue-100 text-lg mb-4">{platform.tagline}</p>
            <div className="flex items-center space-x-4">
              <span className="text-blue-200 text-sm">{platform.market_position}</span>
              <span className="text-blue-200">•</span>
              <span className="text-blue-200 text-sm">{platform.headquarters}</span>
            </div>
          </div>
          <div className="text-right">
            <a
              href={platform.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <span className="mr-2">Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex border-b border-slate-200">
          {[
            { key: 'overview', label: 'Overview', icon: Users },
            { key: 'pricing', label: 'Pricing', icon: DollarSign },
            { key: 'features', label: 'Features & Tech', icon: Zap },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'pricing' && renderPricingTab()}
          {activeTab === 'features' && renderFeaturesTab()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/comparison"
          className="flex items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all"
        >
          <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
          <span className="font-medium text-slate-900">Compare with Others</span>
        </Link>
        <Link
          to="/pricing"
          className="flex items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all"
        >
          <DollarSign className="h-5 w-5 mr-3 text-green-600" />
          <span className="font-medium text-slate-900">Pricing Calculator</span>
        </Link>
        <Link
          to="/performance"
          className="flex items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all"
        >
          <Award className="h-5 w-5 mr-3 text-purple-600" />
          <span className="font-medium text-slate-900">Performance Metrics</span>
        </Link>
      </div>
    </div>
  );
};

export default AgentProfile;
