import { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import Footer from "../Component/footer";
import AppHeader from "../Component/hearder";
import ListVisit from "./noiLuuTru/listVist";


export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{  background: "white" }}
      >
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div>
      <AppHeader />     
      <ListVisit/>
      
      <Footer />
    </div>
  );
}
