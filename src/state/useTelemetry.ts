import { useContext } from "react";
import { SimulationContext } from "./SimulationContext";

export function useTelemetry() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useTelemetry must be used inside SimulationProvider");
  }
  return context;
}
