import React from "react";
import "./loader.css";

interface LoaderProps {
  size?: number; // in pixels
}

export default function Loader({ size = 50 }: LoaderProps) {
  return <div className="loader" style={{ width: size, height: size }} />;
}
