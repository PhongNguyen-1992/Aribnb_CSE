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
  Drawer,
  Badge,
  Tag,
  Space,
  Divider,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Filter, X } from "lucide-react";

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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // 🕒 Debounce logic
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

  // ✅ Lấy danh sách địa điểm unique
  const uniqueLocations = React.useMemo(() => {
    if (!data?.items) return [];
    const locationNames = new Set<string>();
    data.items.forEach((item) => {
      if (item.tinhThanh) locationNames.add(item.tinhThanh);
    });
    return Array.from(locationNames).sort();
  }, [data]);

  // ✅ Filter locations theo địa điểm được chọn
  const filteredLocations = React.useMemo(() => {
    if (!data?.items) return [];
    if (!selectedLocation) return data.items;
    return data.items.filter((item) => item.tinhThanh === selectedLocation);
  }, [data, selectedLocation]);

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

  const handleLocationSelect = (locationName: string) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationName);
    }
    setDrawerOpen(false);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSelectedLocation(null);
    setCurrentPage(1);
  };

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
              <Button size="small" type="primary" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const totalRow = data?.totalRow || 0;
  const displayedLocations = filteredLocations;
  const isEmpty = displayedLocations.length === 0;

  return (
    <div style={containerStyle}>
      <div style={{ padding: `${token.paddingXL}px 0` }}>
        {/* 🔍 Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
          <Search
            placeholder="Tìm kiếm địa điểm..."
            allowClear
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-md rounded-xl"
          />

          <Badge count={selectedLocation ? 1 : 0} offset={[-8, 8]}>
            <Button
              type="primary"
              size="large"
              icon={<Filter size={18} />}
              onClick={() => setDrawerOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg px-6 flex items-center gap-2"
            >
              Địa điểm
            </Button>
          </Badge>
        </div>

        {/* Selected Location Tag */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <Tag
              color="purple"
              closable
              onClose={handleClearFilter}
              className="px-4 py-2 text-base rounded-full font-semibold flex items-center gap-2"
            >
              <MapPin size={16} />
              {selectedLocation}
            </Tag>
          </motion.div>
        )}

        {/* Drawer Địa điểm */}
        <Drawer
          title={
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                <MapPin size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Chọn Địa Điểm
              </span>
            </div>
          }
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={380}
          className="location-drawer"
        >
          <div className="space-y-4">
            {/* Clear All Button */}
            {selectedLocation && (
              <Button
                block
                danger
                icon={<X size={16} />}
                onClick={handleClearFilter}
                className="rounded-xl h-11 font-semibold"
              >
                Xóa bộ lọc
              </Button>
            )}

            <Divider className="my-4">
              <span className="text-gray-500 text-sm">
                {uniqueLocations.length} địa điểm có sẵn
              </span>
            </Divider>

            {/* Location List */}
            <Space direction="vertical" size="small" className="w-full">
              {uniqueLocations.map((locationName, index) => {
                const isSelected = selectedLocation === locationName;

                // ✅ FIXED: Dùng data.items trực tiếp, bỏ allLocationsData
                const sourceData = data?.items || [];
                const count = sourceData.filter(
                  (item) => item.tinhThanh === locationName
                ).length;

                return (
                  <motion.div
                    key={locationName}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      block
                      type={isSelected ? "primary" : "default"}
                      onClick={() => handleLocationSelect(locationName)}
                      className={`h-auto py-3 px-4 rounded-xl text-left font-medium transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-0 shadow-lg scale-105"
                          : "hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected
                                ? "bg-white/20"
                                : "bg-gradient-to-br from-indigo-100 to-purple-100"
                            }`}
                          >
                            <MapPin
                              size={20}
                              className={
                                isSelected ? "text-white" : "text-indigo-600"
                              }
                            />
                          </div>
                          <span
                            className={
                              isSelected ? "text-white" : "text-gray-800"
                            }
                          >
                            {locationName}
                          </span>
                        </div>
                        <Badge
                          count={count}
                          showZero
                          className={isSelected ? "badge-white" : ""}
                          style={{
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.3)"
                              : undefined,
                          }}
                        />
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </Space>

            {uniqueLocations.length === 0 && (
              <Empty description="Không có địa điểm nào" className="py-8" />
            )}
          </div>
        </Drawer>

        {/* Location Cards */}
        <div style={{ position: "relative", minHeight: isEmpty ? 200 : "auto" }}>
          {isFetching && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                borderRadius: token.borderRadius,
                backdropFilter: "blur(4px)",
              }}
            >
              <Spin tip="Đang tải..." size="large" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Empty
                  description={
                    debouncedValue
                      ? "Không tìm thấy địa điểm phù hợp"
                      : selectedLocation
                      ? `Không có địa điểm nào tại ${selectedLocation}`
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
                  {displayedLocations.map((location, index) => (
                    <Col key={location.id} xs={24} sm={12} md={8} lg={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Visit location={location} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {!isEmpty && !selectedLocation && (
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
              className="custom-pagination"
            />
          </div>
        )}
      </div>

      <style>{`
        .location-drawer .ant-drawer-header {
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          border-bottom: 2px solid #e9d5ff;
        }

        .location-drawer .ant-drawer-body {
          background: linear-gradient(to bottom, #fafafa, #ffffff);
        }

        .badge-white .ant-badge-count {
          color: white;
        }

        .custom-pagination .ant-pagination-item-active {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border-color: transparent;
        }

        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }

        .custom-pagination .ant-pagination-item:hover {
          border-color: #a855f7;
        }

        .custom-pagination .ant-pagination-item:hover a {
          color: #a855f7;
        }
      `}</style>
    </div>
  );
};

export default ListVisit;
