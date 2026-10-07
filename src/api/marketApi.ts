import { API_CONFIG, sleep } from './config';
import { MarketOverview, MarketChartData } from '../types';
import mockMarket from '../mock/market.json';

class MarketApi {
  async getOverview(): Promise<MarketOverview> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockMarket.overview as MarketOverview;
    }
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/market/overview`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Market overview fetch failed, using fallback:', err);
    }
    return mockMarket.overview as MarketOverview;
  }

  async getMarketCharts(): Promise<MarketChartData> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockMarket.charts as MarketChartData;
    }
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/market/charts`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Market charts fetch failed, using fallback:', err);
    }
    return mockMarket.charts as MarketChartData;
  }
}

export const marketApi = new MarketApi();
