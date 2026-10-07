import { API_CONFIG, sleep } from './config';
import { MarketOverview, MarketChartData } from '../types';
import mockMarket from '../mock/market.json';

class MarketApi {
  async getOverview(): Promise<MarketOverview> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockMarket.overview as MarketOverview;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/market/overview`);
    if (!res.ok) throw new Error('Failed to fetch market overview');
    return res.json();
  }

  async getMarketCharts(): Promise<MarketChartData> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockMarket.charts as MarketChartData;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/market/charts`);
    if (!res.ok) throw new Error('Failed to fetch market charts');
    return res.json();
  }
}

export const marketApi = new MarketApi();
