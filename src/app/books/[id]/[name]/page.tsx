"use client"; // 이 파일이 클라이언트 컴포넌트임을 명시합니다.

import React, { useEffect, useState } from "react";

const BookPage = ({
  params,
}: {
  params: Promise<{ id: string; name: string }>;
}) => {
  const [name, setName] = useState<string | null>();
  const [context, setContext] = useState();
  const [summary, setSummary] = useState<string | null>(null); // 요약본 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 오류 상태
  const [id, setId] = useState<string | null>(null); // `id` 상태

  // params가 Promise이므로 useEffect로 처리
  useEffect(() => {
    const fetchId = async () => {
      try {
        const unwrappedParams = await params; // Promise 언랩
        setId(unwrappedParams.id);
        setName(unwrappedParams.name); // `id` 상태 업데이트
      } catch (err) {
        setError("ID를 가져오는 데 실패했습니다.");
      }
    };

    fetchId();
  }, [params]); // `params`가 변경되면 다시 실행

  useEffect(() => {
    // `id`가 설정된 후 요약을 가져오는 API 요청
    if (id) {
      const fetchSummary = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8001/info?id=${id}&name=${name}`
          );
          const data = await response.json();
          console.log(data);
          setContext(data.summary);
          setSummary(data.textarea_content); // 요약본 상태 업데이트
          setLoading(false); // 로딩 완료
        } catch (err) {
          setError("데이터를 가져오는 데 실패했습니다.");
          setLoading(false); // 로딩 완료
        }
      };

      fetchSummary(); // `id`가 존재하면 요약 정보를 가져옵니다.
    }
  }, [id]); // `id`가 변경되면 요약 정보를 가져옴

  // 로딩 중일 때
  if (loading) return <div>로딩 중...</div>;

  // 오류가 있을 때
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>
        {name
          ? `${decodeURIComponent(name)}의 정보`
          : "정보를 찾을 수 없습니다"}
      </h1>
      <h2>요약</h2>
      <p>{summary}</p>
      <h2>시험 포인트</h2>
      <p>{context}</p>
    </div>
  );
};

export default BookPage;
