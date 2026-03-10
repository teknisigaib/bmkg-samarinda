// components/hooks/useBoundaryLayers.ts
"use client";

import { useState, useEffect } from "react";

export const useBoundaryLayers = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchBoundaries = async () => {
            try {
                // Pastikan path ini sesuai dengan lokasi file Anda di folder public
                const response = await fetch("/geo/boundaries.json");
                if (!response.ok) throw new Error("Failed to fetch boundaries");
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error("Error loading boundary layer:", error);
            }
        };

        fetchBoundaries();
    }, []);

    return data;
};