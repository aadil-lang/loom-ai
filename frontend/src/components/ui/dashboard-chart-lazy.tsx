"use client";

import dynamic from "next/dynamic";
import * as React from "react";

export const DashboardChart = dynamic(
  () => import("./dashboard-chart").then((mod) => mod.DashboardChart),
  { 
    ssr: false, 
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" /> 
  }
);
