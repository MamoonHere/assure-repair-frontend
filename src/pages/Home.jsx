import { Layout } from "antd";
import Navbar from "../commons/Navbar";
import { useTheme } from "../hooks/useTheme";
import { useGoogleMap } from "../hooks/useGoogleMap";
import { useVehiclesAPI } from "../hooks/useVehiclesAPI";
import { useMarkers } from "../hooks/useMarkers";
import { useSocketVehicles } from "../hooks/useSocketVehicles";
import { useRef } from "react";

const { Content } = Layout;

const Home = () => {
  const { colors } = useTheme();
  const { mapRef } = useGoogleMap();
  const { vehicles, setVehicles } = useVehiclesAPI();
  const markersRef = useRef(new Map());
  const tooltipsRef = useRef(new Map());

  useMarkers(mapRef, vehicles);
  useSocketVehicles(setVehicles, markersRef, tooltipsRef);

  return (
    <Layout style={{ minHeight: "100vh", background: colors.bgContainer }}>
      <Navbar />
      <Content>
        <div
          id="map-container"
          style={{
            width: "100%",
            height: "calc(100vh - 70px)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />
      </Content>
    </Layout>
  );
};

export default Home;
