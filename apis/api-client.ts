import { Alert } from "react-native";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { apiBaseUrl } from "./apis";
import logger from "@/utils/logger";
import asyncStorageConstants from "@/utils/asyncStorageConstants";
import { getItem, clearStorage } from "@/utils/asyncStorage";
import { logoutUser } from "@/utils/utils";
import { store } from "../redux/store";

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
      if (error.response?.data?.message === "Unauthorized") {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please login again.",
          [
            {
              text: "OK",
              onPress: () => {
                logoutUser(store?.dispatch);
              },
              style: "cancel",
            },
          ],
          {
            cancelable: false,
            onDismiss: () => { },
          }
        );
      }

      logger.log("ERROR", error.response?.data?.message);
      throw error;
    }
  );

  return api;
};

const apiClient: AxiosInstance = apiInstance();

export default apiClient;
