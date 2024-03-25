import { newsApiKey } from "./ApiKey";
import axios from "axios";

// Endpoints

const apiBaseUrl = "https://newsapi.org/v2";

const breakingNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=f19d1d2ab62f4c90bff0dc605c8051d3`;
const recommendedNewsUrl = `https://newsapi.org/v2/top-headlines?country=ng&apiKey=f19d1d2ab62f4c90bff0dc605c8051d3`;
// `${apiBaseUrl}/top-headlines?country=us&category=health&apiKey=${newsApiKey}`;

const discoverNewsUrl = (discover) =>
  `${apiBaseUrl}/top-headlines?country=us&category=business&apiKey=${newsApiKey}`;

const searchNewsUrl = (query) =>
  `${apiBaseUrl}/everything?q=${query}&apiKey=${newsApiKey}`;

const newsApiCall = async (endpoints, params) => {
  const options = {
    method: "GET",
    url: endpoints,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);
    return response.data;
    console.log(response);
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const fetchBreakingNews = async () => {
  return await newsApiCall(breakingNewsUrl);
};

export const fetchRecommendedNews = async () => {
  return await newsApiCall(recommendedNewsUrl);
};

export const fetchDiscoverNews = async (discover) => {
  return await newsApiCall(discoverNewsUrl(discover));
};

export const fetchSearchNews = async (query) => {
  const endpoint = searchNewsUrl(query);
  return await newsApiCall(endpoint);
};
