import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const getDevices = async () => {
  const res = await axios.get(`${BASE_URL}/devices/`);
  return res.data;
};

export const getMetrics = async (params) => {
  const res = await axios.get(`${BASE_URL}/metrics/`, { params });
  return res.data;
};

export const generateMetrics = async () => {
  await axios.post(`${BASE_URL}/metrics/generate_metrics/`);
};

export const getMetricTypes = async (params) => {
  const res = await axios.get(`${BASE_URL}/metrics/types/`, { params });
  return res.data;
};

export const updateDevice = async (id, data) => {
  const res = await axios.patch(`${BASE_URL}/devices/${id}/`, data);
  return res.data;
};
