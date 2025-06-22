import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

export const getDevices = async () => {
  const res = await axios.get(`${BASE_URL}/devices`);
  return res.data;
};

export const getMetrics = async (params) => {
  const res = await axios.get(`${BASE_URL}/metrics`, { params });
  return res.data;
};

export const generateMetrics = async () => {
  await axios.post(`${BASE_URL}/metrics/generate`);
};

export const getMetricTypes = async () => {
  const res = await axios.get(`${BASE_URL}/metrics/types`);
  return res.data;
};
