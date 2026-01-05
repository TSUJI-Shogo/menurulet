"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

//csv読み込み型
interface Recipe{
  id: string; //識別用
  name: string; //料理名
  category: string; //材料タイプ
}
interface Category {
  name: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // 選択されたカテゴリ
  const [recipes, setRecipes] = useState<Recipe[]>([]); // 全データ用
  const [result, setResult] = useState<string>("");    // 抽選結果用

  // CSV読み込み
  useEffect(() => {
    // カテゴリの読み込み
    fetch("/cat.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true });
        setCategories(parsed.data);
        // 初期値を最初の項目に設定しておくと親切
        if (parsed.data.length > 0) {
          setSelectedCategory((parsed.data[0] as Category).name);
        }
      });
    //メニューの読み込み
    fetch("/menu_list.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsed = Papa.parse(csvData, { header: true });
        const recipes = parsed.data as Recipe[];
        //ステートに保存
        setRecipes(recipes)
      });
  }, []);

  //抽選
  const randomizeMenu = () =>{
    if (!selectedCategory) {
      alert("カテゴリを選択してください");
      return;
    }
    const filtered = recipes.filter((rData: Recipe)=> rData.category === selectedCategory);

    if(filtered.length > 0){
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const selected = filtered[randomIndex];
      
      // 画面に反映
      setResult(selected.name);
      console.log("抽選結果:", selected.name);
    } else {
      alert("該当するメニューがありません");
    }
  }
  return (
    <main className="p-10 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">献立抽選アプリ</h1>

      {/* カテゴリ選択プルダウン */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-white-700">カテゴリを選んでください</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md bg-gray shadow-sm"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 抽選ボタン */}
      <button
        onClick={randomizeMenu}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
      >
        このカテゴリから抽選する
      </button>

      {/* 結果表示 */}
      {result && (
        <div className="mt-6 p-8 border-4 border-double border-green-200 rounded-xl text-center bg-green-50">
          <p className="text-green-700 text-sm font-bold mb-2">⭐️⭐️⭐️ 今回のメニューは!? ⭐️⭐️⭐️</p>
          <h2 className="text-3xl font-extrabold text-gray-800">{result}</h2>
        </div>
      )}
    </main>
  );
}
