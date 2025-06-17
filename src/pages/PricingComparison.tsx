import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, DollarSign, TrendingUp, Award, Users, Zap } from 'lucide-react';

interface PlatformData {
  platforms: Record<string, any>;
  market_analysis: any;
}

const PricingComparison: React.FC = () => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculatorMode, setCalculatorMode] = useState<'monthly' | 'annual'>('monthly');
  const [usageLevel, setUsageLevel] = useState<'low' | 'medium' | 'high'>('medium');

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

  const extractPricingData = () => {
    if (!data) return [];
    
    return Object.entries(data.platforms).map(([key, platform]) => {
      const pricing = platform.pricing;
      let startingPrice = 0;
      let midTierPrice = 0;
      
      // Extract starting and mid-tier prices
      Object.entries(pricing).forEach(([tier, details]: [string, any]) => {
        if (details.price && typeof details.price === 'string') {
          const priceValue = parseFloat(details.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(priceValue)) {
            if (startingPrice === 0 || priceValue < startingPrice) {
              startingPrice = priceValue;
            }
            if (priceValue > startingPrice && (midTierPrice === 0 || priceValue < midTierPrice)) {
              midTierPrice = priceValue;
            }
          }
        }
      });
      
      return {
        name: platform.name,
        starting: startingPrice,
        midTier: midTierPrice || startingPrice * 2,
        key: key
      };
    }).filter(item => item.starting > 0);
  };

  const getUsageRecommendation = (usageLevel: string) => {
    if (!data) return [];
    
    const recommendations = [];
    Object.entries(data.platforms).forEach(([key, platform]) => {
      const pricing = platform.pricing;
      let recommendedTier = null;
      
      if (usageLevel === 'low') {
        recommendedTier = Object.entries(pricing).find(([tier, details]: [string, any]) => 
          tier.includes('free') || tier.includes('starter') || (details.price && details.price.includes('$0'))
        );
      } else if (usageLevel === 'medium') {
        recommendedTier = Object.entries(pricing).find(([tier, details]: [string, any]) => 
          tier.includes('pro') || tier.includes('professional') || tier.includes('plus')
        );
      } else {
        recommendedTier = Object.entries(pricing).find(([tier, details]: [string, any]) => 
          tier.includes('team') || tier.includes('enterprise') || tier.includes('business')
        );
      }
      
      if (!recommendedTier) {
        recommendedTier = Object.entries(pricing)[Math.floor(Object.entries(pricing).length / 2)];
      }
      
      if (recommendedTier) {
        const [tierName, tierDetails] = recommendedTier;
        recommendations.push({
          platform: platform.name,
          key: key,
          tier: tierName,
          price: tierDetails.price || 'Custom',
          credits: tierDetails.credits || 'N/A',
          features: tierDetails.features || []
        });
      }
    });
    
    return recommendations;
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

  const pricingData = extractPricingData();
  const usageRecommendations = getUsageRecommendation(usageLevel);
  
  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pricing Comparison & Calculator</h1>
        <p className="text-slate-600">Compare pricing plans and find the best value for your needs</p>
      </div>

      {/* Pricing Overview Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Starting Price Comparison</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pricingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${value}`, name === 'starting' ? 'Starting Price' : 'Mid-Tier Price']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="starting" fill="#3B82F6" name="starting" />
              <Bar dataKey="midTier" fill="#6366F1" name="midTier" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Calculator */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center mb-4">
          <Calculator className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-slate-800">Pricing Calculator</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Billing Frequency</label>
            <div className="flex space-x-2">
              {['monthly', 'annual'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setCalculatorMode(mode as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    calculatorMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Usage Level</label>
            <div className="flex space-x-2">
              {[
                { key: 'low', label: 'Light', icon: Users },
                { key: 'medium', label: 'Regular', icon: Zap },
                { key: 'high', label: 'Heavy', icon: TrendingUp }
              ].map(level => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.key}
                    onClick={() => setUsageLevel(level.key as any)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      usageLevel === level.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {level.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recommended Plans for {usageLevel.charAt(0).toUpperCase() + usageLevel.slice(1)} Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usageRecommendations.map((rec, index) => (
              <div key={rec.key} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{rec.platform}</h4>
                  {index === 0 && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-slate-600 capitalize mb-2">{rec.tier.replace('_', ' ')} Plan</div>
                <div className="text-xl font-bold text-blue-600 mb-2">{rec.price}</div>
                {rec.credits !== 'N/A' && (
                  <div className="text-sm text-slate-600 mb-3">{rec.credits}</div>
                )}
                <div className="space-y-1">
                  {rec.features.slice(0, 3).map((feature: string, idx: number) => (
                    <div key={idx} className="text-xs text-slate-600 flex items-center">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Pricing Leaders</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-800">Most Affordable</div>
                <div className="text-sm text-green-600">{data.market_analysis.pricing_trends.most_affordable}</div>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-800">Best Free Tier</div>
                <div className="text-sm text-blue-600">{data.market_analysis.pricing_trends.best_free_tier}</div>
              </div>
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-800">Enterprise Leader</div>
                <div className="text-sm text-purple-600">{data.market_analysis.pricing_trends.enterprise_leader}</div>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Price Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pricingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="starting"
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {pricingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Starting Price']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Pricing Tables */}
      <div className="space-y-8">
        {Object.entries(data.platforms).map(([key, platform]) => (
          <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{platform.name} Pricing</h3>
              <span className="text-sm text-slate-600">{platform.market_position}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(platform.pricing).map(([tier, details]: [string, any]) => (
                <div key={tier} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-800 capitalize mb-2">
                      {tier.replace('_', ' ')}
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {details.price || 'Custom'}
                    </div>
                    {details.credits && (
                      <div className="text-sm text-slate-600 mb-3">{details.credits}</div>
                    )}
                    {details.features && (
                      <ul className="text-left space-y-2 mt-4">
                        {details.features.map((feature: string, index: number) => (
                          <li key={index} className="text-sm text-slate-600 flex items-start">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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
        ))}
      </div>
    </div>
  );
};

export default PricingComparison;
