import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Award, Globe, Calendar, ArrowRight, DollarSign, Zap, Brain, Building } from 'lucide-react';

interface PlatformData {
  research_metadata: any;
  platforms: Record<string, any>;
  market_analysis: any;
  recommendations: any;
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const platformCount = Object.keys(data.platforms).length;
  const sourceCount = data.research_metadata.sources_verified;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          Updated: {data.research_metadata.report_date}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          AI Agents Comparison Hub
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Comprehensive analysis of {platformCount} leading AI agent platforms, researched from {sourceCount}+ verified sources 
          to help you make informed decisions in the rapidly evolving AI landscape.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/comparison"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Comparing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-all"
          >
            View Pricing
            <DollarSign className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Platforms Analyzed</p>
              <p className="text-2xl font-bold text-slate-900">{platformCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Sources Verified</p>
              <p className="text-2xl font-bold text-slate-900">{sourceCount}+</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Market Coverage</p>
              <p className="text-2xl font-bold text-slate-900">Global</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Research Period</p>
              <p className="text-2xl font-bold text-slate-900">2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing Leaders</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Most Affordable</span>
                <span className="font-semibold text-green-600">{data.market_analysis.pricing_trends.most_affordable}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Best Free Tier</span>
                <span className="font-semibold text-blue-600">{data.market_analysis.pricing_trends.best_free_tier}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Enterprise Leader</span>
                <span className="font-semibold text-purple-600">{data.market_analysis.pricing_trends.enterprise_leader}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Feature Excellence</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Technical Capabilities</span>
                <span className="font-semibold text-blue-600">{data.market_analysis.feature_leaders.technical_capabilities}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Automation</span>
                <span className="font-semibold text-green-600">{data.market_analysis.feature_leaders.automation}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Knowledge Management</span>
                <span className="font-semibold text-purple-600">{data.market_analysis.feature_leaders.knowledge_management}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(data.platforms).map(([key, platform]) => (
            <Link
              key={key}
              to={`/agent/${key}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{platform.name}</h3>
                <p className="text-sm text-slate-600">{platform.tagline}</p>
                <p className="text-xs text-slate-500 mt-1">{platform.headquarters}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Market Position</span>
                  <span className="text-xs font-medium text-blue-600">{platform.market_position}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {platform.core_features.slice(0, 2).map((feature: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Find Your Perfect AI Agent?</h2>
          <p className="text-blue-100">Explore detailed comparisons and make informed decisions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/comparison"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <Brain className="h-6 w-6 mr-3" />
            <span className="font-medium">Compare Features</span>
          </Link>
          <Link
            to="/pricing"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <DollarSign className="h-6 w-6 mr-3" />
            <span className="font-medium">Analyze Pricing</span>
          </Link>
          <Link
            to="/performance"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <Zap className="h-6 w-6 mr-3" />
            <span className="font-medium">View Performance</span>
          </Link>
          <Link
            to="/news"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <Building className="h-6 w-6 mr-3" />
            <span className="font-medium">Latest Updates</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
