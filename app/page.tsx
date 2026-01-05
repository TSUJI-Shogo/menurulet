"use client";

import { useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  // CSV読み込み
  useEffect(() => {
    fetch("/menu_list.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsed = Papa.parse(csvData, { header: true });
        console.log("解析されたデータ:", parsed.data);
      });
  }, []);

  return <main> test </main>;
}
