import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Pagination,
  Empty,
  theme,
  Typography,
} from "antd";

import Visit from "./Visit";
import { getLocationsPagingAPI } from "../../service/location.api";
import type { Location, PaginatedLocation } from "../../interfaces/location.interface";

const { useToken } = theme;
const { Title, Text } = Typography;

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16, 20, 24];

const ListVisit: React.FC = () => {
  const { token } = useToken();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  // ✅ type đúng cho react-query
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<PaginatedLocation<Location>, Error>({
    queryKey: ["locations", currentPage, pageSize],
    queryFn: () => getLocationsPagingAPI(currentPage, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (prev) => prev,
  });

  // ✅ Pagination change
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

  // ✅ Show total
  const handleShowTotal = useCallback(
    (total: number, range: [number, number]) =>
      `Hiển thị ${range[0]}–${range[1]} trong tổng số ${total} địa điểm`,
    []
  );

  const containerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: `0 ${token.padding}px`,
  };

  // ✅ Loading
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
              <Button
                size="small"
                type="primary"
                onClick={() => window.location.reload()}
              >
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
        {/* Header */}
        <div style={{ marginBottom: token.marginXL, textAlign: "center" }}>
          <Title
            level={2}
            style={{ marginBottom: token.marginXS, color: token.colorText }}
          >
            Khám Phá Các Điểm Đến
          </Title>
          <Text type="secondary" style={{ fontSize: token.fontSizeLG }}>
            Chọn địa điểm yêu thích để xem các phòng nghỉ tuyệt vời
          </Text>
          {data && (
            <div style={{ marginTop: token.marginSM }}>
              <Text type="secondary" style={{ fontSize: token.fontSize }}>
                Hiển thị {locations.length} trong tổng số {totalRow} địa điểm
                {totalPage > 1 && ` • Trang ${currentPage}/${totalPage}`}
              </Text>
            </div>
          )}
        </div>

        {/* Location Cards */}
        <div style={{ position: "relative", minHeight: isEmpty ? 200 : "auto" }}>
          {isFetching && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: token.colorBgMask,
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

          {isEmpty ? (
            <Empty
              description="Không tìm thấy địa điểm nào"
              style={{ padding: `${token.paddingXL * 2}px 0` }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {locations.map((location) => (
                <Col key={location.id} xs={24} sm={12} md={8} lg={6}>
                  <Visit location={location} />
                </Col>
              ))}
            </Row>
          )}
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
