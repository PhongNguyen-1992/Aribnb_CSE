import type { Location, PaginatedLocation } from "../interfaces/location.interface";
import api from "./api";

export const getLocationsPagingAPI = async (
  pageIndex: number = 1,
  pageSize: number = 4,
  keyword: string = ""
): Promise<PaginatedLocation<Location>> => {
  const res = await api.get(`/vi-tri/phan-trang-tim-kiem`, {
    params: { 
      pageIndex, 
      pageSize,
      ...(keyword.trim() && { keyword: keyword.trim() }) // gửi keyword nếu có
    },
  });

  const data = res.data?.content;

  return {
    items: data?.data || data?.items || [],
    pageIndex: data?.pageIndex || pageIndex,
    pageSize: data?.pageSize || pageSize,
    totalRow: data?.totalRow || 0,
    totalPages: data?.totalPages || Math.ceil((data?.totalRow || 0) / pageSize),
  };
};
