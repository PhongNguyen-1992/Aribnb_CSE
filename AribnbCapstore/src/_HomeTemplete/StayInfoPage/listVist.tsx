import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Pagination,
  Empty,
  Input,
  theme,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";

import Visit from "./Visit";
import { getLocationsPagingAPI } from "../../service/location.api";
import type {
  Location,
  PaginatedLocation,
} from "../../interfaces/location.interface";

const { useToken } = theme;
const { Search } = Input;

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16, 20, 24];

const ListVisit: React.FC = () => {
  const { token } = useToken();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  // 🕒 Debounce logic (mượt khi người dùng gõ)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(searchValue), 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // ✅ Query API
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    PaginatedLocation<Location>,
    Error
  >({
    queryKey: ["locations", currentPage, pageSize, debouncedValue],
    queryFn: () => getLocationsPagingAPI(currentPage, pageSize, debouncedValue),   
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Pagination
  const handlePageChange = useCallback(
    (page: number, size?: number) => {
      setCurrentPage(page);
      if (size && size !== pageSize) {
        setPageSize(size);
        setCurrentPage(1);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pageSize]
  );

  const handleShowTotal = (total: number, range: [number, number]) =>
    `Hiển thị ${range[0]}–${range[1]} trong tổng số ${total} địa điểm`;

  const containerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: `0 ${token.padding}px`,
  };

  // ✅ Loading toàn phần ban đầu
  if (isLoading && !data) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            padding: `${token.paddingLG}px 0`,
          }}
        >
          <Spin size="large" tip="Đang tải danh sách vị trí..." />
        </div>
      </div>
    );
  }

  // ✅ Error
  if (isError) {
    return (
      <div style={containerStyle}>
        <div style={{ padding: `${token.padding}px 0` }}>
          <Alert
            type="error"
            message="Lỗi tải dữ liệu"
            description={error?.message || "Không thể tải danh sách địa điểm"}
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // ✅ Dữ liệu chính xác
  const locations: Location[] = data?.items || [];
  const totalRow = data?.totalRow || 0;
  const totalPage = Math.ceil(totalRow / pageSize);
  const isEmpty = locations.length === 0;

  return (
    <div style={containerStyle}>
      <div style={{ padding: `${token.paddingXL}px 0` }}>
        {/* 🔍 Thanh tìm kiếm (mượt hơn) */}
        <div style={{ marginBottom: token.marginLG, textAlign: "center" }}>
          <Search
            placeholder="Tìm kiếm địa điểm..."
            allowClear
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Danh sách địa điểm */}
        <div style={{ position: "relative", minHeight: isEmpty ? 200 : "auto" }}>
          {isFetching && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                borderRadius: token.borderRadius,
              }}
            >
              <Spin tip="Đang tải..." />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Empty
                  description={
                    debouncedValue
                      ? "Không tìm thấy địa điểm phù hợp"
                      : "Không có địa điểm nào"
                  }
                  style={{ padding: `${token.paddingXL * 2}px 0` }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Row gutter={[24, 24]}>
                  {locations.map((location) => (
                    <Col key={location.id} xs={24} sm={12} md={8} lg={6}>
                      <Visit location={location} />
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPage > 1 && (
          <div
            style={{
              marginTop: token.marginXL,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pagination
              current={currentPage}
              total={totalRow}
              pageSize={pageSize}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={handleShowTotal}
              pageSizeOptions={PAGE_SIZE_OPTIONS.map(String)}
              itemRender={(_, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <Button size="small" type="text" disabled={currentPage === 1}>
                      ‹ Trước
                    </Button>
                  );
                }
                if (type === "next") {
                  return (
                    <Button
                      size="small"
                      type="text"
                      disabled={currentPage === totalPage}
                    >
                      Sau ›
                    </Button>
                  );
                }
                return originalElement;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListVisit;
