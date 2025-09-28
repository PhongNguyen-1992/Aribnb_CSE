// src/components/LocationList.tsx
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Typography,
  Pagination,
  Empty,
  theme,
  Select, 
} from "antd";
import { EnvironmentOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getLocationsPagingAPI } from "../service/location.api";

const { Text, Title } = Typography;
const { useToken } = theme;
const { Option } = Select;

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

interface PaginatedLocationResponse {
  data: Location[];
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  totalPage: number;
}

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16, 20, 24];

const LocationList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [showPaginationSettings, setShowPaginationSettings] = useState<boolean>(false);

  const { data, isLoading, isError, error, isFetching } = useQuery<
    PaginatedLocationResponse,
    Error
  >({
    queryKey: ["locations", currentPage, pageSize],
    queryFn: async () => getLocationsPagingAPI(currentPage, pageSize),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleViewRooms = useCallback(
    (locationId: number, locationName: string) => {
      navigate(`/rooms?locationId=${locationId}&locationName=${encodeURIComponent(locationName)}`);
    },
    [navigate]
  );

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

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleShowTotal = useCallback((total: number, range: [number, number]) => {
    return `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} địa điểm`;
  }, []);

  const containerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: `0 ${token.padding}px`,
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: token.borderRadius,
    overflow: "hidden",
    boxShadow: token.boxShadow,
    border: "none",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

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
              <Button size="small" type="primary" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const locations = data?.data || [];
  const isEmpty = locations.length === 0;

  return (
    <div style={containerStyle}>
      <div style={{ padding: `${token.paddingXL}px 0` }}>
        {/* Header */}
        <div style={{ marginBottom: token.marginXL, textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: token.marginXS, color: token.colorText }}>
            Khám Phá Các Điểm Đến
          </Title>
          <Text type="secondary" style={{ fontSize: token.fontSizeLG }}>
            Chọn địa điểm yêu thích để xem các phòng nghỉ tuyệt vời
          </Text>
          {data && (
            <div style={{ marginTop: token.marginSM }}>
              <Text type="secondary" style={{ fontSize: token.fontSize }}>
                Hiển thị {locations.length} trong tổng số {data.totalRow} địa điểm
              </Text>
            </div>
          )}
        </div>

        {/* Pagination Settings */}
        <div
          style={{
            marginBottom: token.marginLG,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: token.margin,
          }}
        >
          <Button
            icon={<SettingOutlined />}
            type="text"
            onClick={() => setShowPaginationSettings(!showPaginationSettings)}
            style={{ color: token.colorTextSecondary }}
          >
            Cài đặt hiển thị
          </Button>

          {showPaginationSettings && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: token.marginSM,
                background: token.colorFillAlter,
                padding: `${token.paddingSM}px ${token.padding}px`,
                borderRadius: token.borderRadius,
                border: `1px solid ${token.colorBorder}`,
              }}
            >
              <Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
                Số địa điểm mỗi trang:
              </Text>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 140 }}
                size="small"
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
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
              {locations.map((loc) => (
                <Col key={loc.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={
                      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                        <img
                          alt={loc.tenViTri}
                          src={loc.hinhAnh}
                          loading="lazy"
                          style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src =
                              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop&crop=center";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: token.marginSM,
                            right: token.marginSM,
                            background: token.colorBgContainer,
                            borderRadius: token.borderRadiusLG,
                            padding: `${token.paddingXXS}px ${token.paddingSM}px`,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <EnvironmentOutlined style={{ color: token.colorPrimary }} />
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="view-rooms"
                        type="primary"
                        icon={<EyeOutlined />}
                        block
                        onClick={() => handleViewRooms(loc.id, loc.tenViTri)}
                      >
                        Xem Phòng
                      </Button>,
                    ]}
                  >
                    <Title level={5} ellipsis={{ tooltip: loc.tenViTri }}>
                      {loc.tenViTri}
                    </Title>
                    <Text type="secondary">
                      {loc.tinhThanh}, {loc.quocGia}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPage > 0 && (
          <div style={{ marginTop: token.marginXL }}>
            <Pagination
              current={currentPage}
              total={data.totalRow}
              pageSize={pageSize}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={handleShowTotal}
              pageSizeOptions={PAGE_SIZE_OPTIONS.map((opt) => opt.toString())}
              itemRender={(page, type, originalElement) => {
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
                      disabled={currentPage === data.totalPage}
                    >
                      Sau ›
                    </Button>
                  );
                }
                return originalElement;
              }}
              hideOnSinglePage={false} // luôn hiển thị
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationList;
