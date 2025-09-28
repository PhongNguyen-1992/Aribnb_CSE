// src/service/locationAPI.ts
import type { Location, PaginatedLocation } from "../interfaces/location.interface";
import api from "./api";

export const getLocationsPagingAPI = async (
  pageIndex: number = 1,
  pageSize: number = 5
): Promise<PaginatedLocation<Location>> => {
  const response = await api.get<{ content: PaginatedLocation<Location> }>(
    `/vi-tri/phan-trang-tim-kiem`,
    {
      params: {
        pageIndex,
        pageSize,
      },
    }
  );

  return response.data.content;
};
