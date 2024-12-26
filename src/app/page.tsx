"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [datas, setDatas] = useState<any>(null); // 초기값을 null로 설정
  const [SearchText, setSearchText] = useState("");

  const SearchClick = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/bookInfo?book=${SearchText}`
      );
      const jsonData = await response.json(); // JSON 데이터로 변환
      setDatas(jsonData); // 데이터를 상태로 설정
    } catch (error) {
      console.error("Error fetching data:", error);
      setDatas(null); // 에러 발생 시 null로 설정
    }
  };

  return (
    <div>
      <h1>문학 책 요약기</h1>

      <div className="Search">
        <input
          value={SearchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <button onClick={SearchClick}>검색하기</button>
      </div>
      <div>
        {datas && datas.title && datas.img ? (
          datas.title.map((title: string, index: number) => (
            <Link href={`/books/${datas.ids[index]}/${title}`}>
              <div key={index}>
                <h2>{title}</h2>
                <img src={datas.img[index]} alt={title} />
              </div>
            </Link>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
