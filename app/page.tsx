"use client";

import { useEffect } from "react";
import Papa from "papaparse";

interface Recipe{
  id: string; //識別用
  name: string; //料理名
  category: string; //材料タイプ
}

export default function Home() {
  // CSV読み込み
  useEffect(() => {
    fetch("/menu_list.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsed = Papa.parse(csvData, { header: true });
        const recipes = parsed.data as Recipe[];
        console.log("絞り込みなし:", parsed.data);

        const category: string = "鶏肉";
        const filtered_recipes: Recipe[] = recipes.filter((recipe: Recipe) => recipe.category === category);
        
        console.log("絞り込みあり:",filtered_recipes);
      });
  }, []);

  return <main> test </main>;
}
