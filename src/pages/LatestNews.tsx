import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Building, Zap, Globe, ExternalLink } from 'lucide-react';

interface PlatformData {
  platforms: Record<string, any>;
  market_analysis: any;
}

const LatestNews: React.FC = () => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'acquisitions' | 'updates' | 'releases'>('all');

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

  const generateNewsItems = () => {
    if (!data) return [];
    
    const newsItems = [];
    
    // Add platform-specific updates
    Object.entries(data.platforms).forEach(([key, platform]) => {
      if (platform.recent_updates) {
        Object.entries(platform.recent_updates).forEach(([updateKey, updateValue]) => {
          newsItems.push({
            id: `${key}-${updateKey}`,
            title: updateValue,
            platform: platform.name,
            category: updateKey.includes('acquisition') ? 'acquisitions' : 
                     updateKey.includes('release') ? 'releases' : 'updates',
            date: '2025-06-17',
            type: updateKey,
            description: `${platform.name} announces ${updateValue}`,
            impact: 'high'
          });
        });
      }
    });
    
    // Add market trends
    if (data.market_analysis?.key_trends) {
      data.market_analysis.key_trends.forEach((trend: string, index: number) => {
        newsItems.push({
          id: `trend-${index}`,
          title: trend,
          platform: 'Market Analysis',
          category: 'updates',
          date: '2025-06-17',
          type: 'trend',
          description: `Industry trend: ${trend}`,
          impact: 'medium'
        });
      });
    }
    
    return newsItems.sort((a, b) => b.date.localeCompare(a.date));
  };

  const getNewsIcon = (category: string) => {
    switch (category) {
      case 'acquisitions': return Building;
      case 'releases': return Zap;
      case 'updates': return TrendingUp;
      default: return Globe;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
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

  const newsItems = generateNewsItems();
  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Latest News & Updates</h1>
        <p className="text-slate-600">Stay informed about the latest developments in AI agents - June 2025</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All News', icon: Globe },
            { key: 'acquisitions', label: 'Acquisitions', icon: Building },
            { key: 'updates', label: 'Platform Updates', icon: TrendingUp },
            { key: 'releases', label: 'New Releases', icon: Zap }
          ].map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured News */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 mr-3" />
          <span className="text-blue-100">Breaking News - June 2025</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Major Developments in AI Agents Market</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Salesforce Acquisition</h3>
            <p className="text-blue-100">Convergence.ai successfully acquired by Salesforce, marking a significant consolidation in the enterprise AI agents space.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Open Source Revolution</h3>
            <p className="text-blue-100">MiniMax releases M1 open-source model, changing the landscape for AI agent development and accessibility.</p>
          </div>
        </div>
      </div>

      {/* News Timeline */}
      <div className="space-y-6">
        {filteredNews.map(newsItem => {
          const Icon = getNewsIcon(newsItem.category);
          return (
            <div key={newsItem.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-slate-900">{newsItem.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(newsItem.impact)}`}>
                        {newsItem.impact.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">{newsItem.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-blue-600">{newsItem.platform}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-sm text-slate-600 capitalize">{newsItem.category}</span>
                  </div>
                  <p className="text-slate-700 mb-3">{newsItem.description}</p>
                  {newsItem.platform !== 'Market Analysis' && (
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      <span>Learn more about {newsItem.platform}</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No news in this category</h3>
          <p className="text-slate-600">Try selecting a different category to see more updates.</p>
        </div>
      )}

      {/* Market Insights */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Market Insights Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Key Trends Shaping 2025</h3>
            <ul className="space-y-2">
              {data.market_analysis?.key_trends?.slice(0, 3).map((trend: string, index: number) => (
                <li key={index} className="flex items-start">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Geographic Distribution</h3>
            <div className="space-y-2">
              {Object.entries(data.market_analysis?.geographic_distribution || {}).map(([region, platforms]) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">{region.replace('_', ' ')}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {Array.isArray(platforms) ? platforms.join(', ') : String(platforms)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
