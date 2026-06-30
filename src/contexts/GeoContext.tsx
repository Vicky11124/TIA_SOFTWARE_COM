import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Geo = "UK" | "US";

interface GeoContextType {
  geo: Geo;
  setGeo: (g: Geo) => void;
  currency: string;
  currencySymbol: string;
}

const GeoContext = createContext<GeoContextType>({
  geo: "UK",
  setGeo: () => {},
  currency: "GBP",
  currencySymbol: "£",
});

export const useGeo = () => useContext(GeoContext);

export const GeoProvider = ({ children }: { children: ReactNode }) => {
  const [geo, setGeoState] = useState<Geo>(() => {
    return (localStorage.getItem("tia_geo") as Geo) || "UK";
  });

  const setGeo = (g: Geo) => {
    setGeoState(g);
    localStorage.setItem("tia_geo", g);
  };

  const currency = geo === "UK" ? "GBP" : "USD";
  const currencySymbol = geo === "UK" ? "£" : "$";

  return (
    <GeoContext.Provider value={{ geo, setGeo, currency, currencySymbol }}>
      {children}
    </GeoContext.Provider>
  );
};
