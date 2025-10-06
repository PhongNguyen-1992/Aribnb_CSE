import React from "react";
import { Card, Button, Typography, theme, Space } from "antd";
import { EnvironmentOutlined, EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Location } from "../../interfaces/location.interface";

const { Text, Title } = Typography;
const { useToken } = theme;

interface VisitProps {
  location: Location;
}

const Visit: React.FC<VisitProps> = ({ location }) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleViewRoom = () => {
    navigate(`/room-detail/${location.id}/${location.tenViTri}`);
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    overflow: "hidden",
    border: `1px solid ${token.colorBorderSecondary}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
    boxShadow: isHovered
      ? "0 12px 24px rgba(0, 0, 0, 0.12)"
      : "0 2px 8px rgba(0, 0, 0, 0.06)",
  };

  const imageOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isHovered
      ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%)"
      : "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%)",
    transition: "all 0.3s ease",
  };

  return (
    <Card
      hoverable
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cover={
        <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
          <img
            alt={location.tenViTri}
            src={location.hinhAnh}
            loading="lazy"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center";
            }}
          />
          <div style={imageOverlayStyle} />

          {/* Location Badge */}
          <div
            style={{
              position: "absolute",
              top: token.marginSM,
              left: token.marginSM,
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: token.borderRadiusSM,
              padding: `${token.paddingXXS}px ${token.paddingSM}px`,
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <EnvironmentOutlined style={{ color: token.colorPrimary, fontSize: 14 }} />
            <Text style={{ fontSize: 12, fontWeight: 500, margin: 0 }}>
              {location.quocGia}
            </Text>
          </div>

          {/* Favorite Button */}
          <Button
            type="text"
            shape="circle"
            icon={
              <HeartOutlined
                style={{
                  fontSize: 18,
                  color: isFavorite ? token.colorError : "white",
                  transition: "all 0.3s ease",
                }}
              />
            }
            style={{
              position: "absolute",
              top: token.marginSM,
              right: token.marginSM,
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              width: 36,
              height: 36,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          />
        </div>
      }
      bodyStyle={{
        padding: token.padding,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <Title
          level={5}
          ellipsis={{ tooltip: location.tenViTri }}
          style={{ marginBottom: 0, fontSize: 16, fontWeight: 600 }}
        >
          {location.tenViTri}
        </Title>

        <Text type="secondary" style={{ fontSize: 13 }}>
          {location.tinhThanh}
        </Text>
      </Space>

      <Button
        type="primary"
        icon={<EyeOutlined />}
        block
        size="large"
        onClick={handleViewRoom}
        style={{
          marginTop: token.marginSM,
          height: 44,
          borderRadius: token.borderRadius,
          fontWeight: 500,
          background: isHovered ? token.colorPrimaryHover : token.colorPrimary,
          transition: "all 0.3s ease",
        }}
      >
        Xem Phòng
      </Button>
    </Card>
  );
};

export default Visit;
