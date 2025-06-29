
import { clearStorage, getItem } from "@/utils/asyncStorage";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import asyncStorageConstants from "../utils/asyncStorageConstants";
import logger from "../utils/logger";
import { apiBaseUrl } from "./apis";

const apiInstance = (): AxiosInstance => {
  const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
  });
  axiosRetry(api, { retries: 2 });

  api.interceptors.request.use(async (config: any) => {
    const accessToken = await getItem(asyncStorageConstants.accessToken);
    const parsedToken = accessToken;
    console.log(parsedToken, "setjkjk");
    if (parsedToken) {
      config.headers.authorization = `Bearer ${parsedToken}`;
    }
    logger.log("REQUEST", config);
    return config;
  });

  api.interceptors.response.use(
    (response: any) => {
      logger.log("RESPONSE", response);
      return response;
    },
    (error: any) => {
      console.log(error, "aaayaaaaa");
      if (error.response?.data?.detail === "Invalid Token") {
        clearStorage();
      }
    

      logger.log("ERROR", error.response?.data?.message);
      throw error;
    }
  );

  return api;
};

const apiClient: AxiosInstance = apiInstance();

export default apiClient;
