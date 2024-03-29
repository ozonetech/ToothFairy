import axios from "axios";

export const getDetailedCoinData = async (coinId) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=f19d1d2ab62f4c90bff0dc605c8051d3`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getCoinMarketChart = async (coinId, selectedRange) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/usd/market_chart?vs_currency=ngn&days=1`
    );
    return response.data;
  } catch (e) {
    console.log("error comes from here", e);
  }
};

export const getMarketData = async (pageNumber = 1) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getMarketDataNaira = async (pageNumber = 1) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=us&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getWatchlistedCoins = async (pageNumber = 1, coinIds) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllCoins = async () => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/list?include_platform=false`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const getCandleChartData = async (coinId, days = 1) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
