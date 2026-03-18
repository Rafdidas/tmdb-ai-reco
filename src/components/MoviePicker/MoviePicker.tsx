"use client";

import { useEffect, useMemo, useState } from "react";
import type { Movie } from "@/types/movie";
import type { TasteAnalysis } from "@/types/taste";
import MovieCard from "@/components/MovieCard/MovieCard";
import Pagination from "@/components/Pagination/Pagination";
import RecommendedMovieCard from "@/components/RecommendedMovieCard/RecommendedMovieCard";
import styles from "./MoviePicker.module.scss";

type MoviePickerProps = {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  query?: string;
};

const MAX_SELECTION = 5;

export default function MoviePicker({
  movies,
  currentPage,
  totalPages,
  query,
}: MoviePickerProps) {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [analysis, setAnalysis] = useState<TasteAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedIds = useMemo(
    () => new Set(selectedMovies.map((movie) => movie.id)),
    [selectedMovies],
  );

  const handleToggleSelect = (movie: Movie) => {
    const isSelected = selectedIds.has(movie.id);

    setAnalysis(null);
    setErrorMessage("");

    if (isSelected) {
      setSelectedMovies((prev) => prev.filter((item) => item.id !== movie.id));
      return;
    }

    if (selectedMovies.length >= MAX_SELECTION) {
      alert("최대 5개까지 선택할 수 있습니다.");
      return;
    }

    setSelectedMovies((prev) => [...prev, movie]);
  };

  const handleAnalyzeTaste = async () => {
    if (selectedMovies.length === 0) {
      alert("먼저 영화를 1개 이상 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setAnalysis(null);

      const response = await fetch("/api/analyze-taste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movies: selectedMovies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || "AI 분석에 실패했습니다.");
      }

      const result = (await response.json()) as TasteAnalysis;
      setAnalysis(result);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResetHome = () => {
      setSelectedMovies([]);
      setAnalysis(null);
      setIsLoading(false);
      setErrorMessage("");
    };

    window.addEventListener("app:reset-home", handleResetHome);

    return () => {
      window.removeEventListener("app:reset-home", handleResetHome);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <section className={styles.selectedSection}>
        <div className={styles.selectedHeader}>
          <h2 className={styles.selectedTitle}>내 취향으로 담은 영화</h2>
          <p className={styles.selectedCount}>
            {selectedMovies.length} / {MAX_SELECTION}
          </p>
        </div>

        {selectedMovies.length === 0 ? (
          <p className={styles.emptyText}>마음에 드는 영화를 선택해보세요.</p>
        ) : (
          <>
            <ul className={styles.selectedList}>
              {selectedMovies.map((movie) => (
                <li key={movie.id} className={styles.selectedItem}>
                  <span className={styles.selectedName}>{movie.title}</span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleToggleSelect(movie)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.analysisAction}>
              <button
                type="button"
                className={styles.analysisButton}
                onClick={handleAnalyzeTaste}
                disabled={isLoading}
              >
                {isLoading ? "분석 중..." : "AI 취향 분석"}
              </button>
            </div>
          </>
        )}

        {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

        {analysis ? (
          <section className={styles.analysisResult}>
            <h3 className={styles.analysisTitle}>AI 취향 분석 결과</h3>

            <div className={styles.analysisBlock}>
              <h4 className={styles.analysisLabel}>한 줄 요약</h4>
              <p className={styles.analysisText}>{analysis.summary}</p>
            </div>

            <div className={styles.analysisBlock}>
              <h4 className={styles.analysisLabel}>취향 키워드</h4>
              <ul className={styles.keywordList}>
                {analysis.keywords.map((keyword) => (
                  <li key={keyword} className={styles.keywordItem}>
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.analysisBlock}>
              <h4 className={styles.analysisLabel}>추천 분위기</h4>
              <ul className={styles.keywordList}>
                {analysis.recommendedMoods.map((mood) => (
                  <li key={mood} className={styles.keywordItem}>
                    {mood}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.analysisBlock}>
              <h4 className={styles.analysisLabel}>이런 영화도 추천해요</h4>

              {analysis.recommendedMovieResults.length === 0 ? (
                <p className={styles.analysisText}>추천 영화를 찾지 못했습니다.</p>
              ) : (
                <div className={styles.recommendationGrid}>
                  {analysis.recommendedMovieResults.map((movie) => (
                    <RecommendedMovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </section>

      <section className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            selected={selectedIds.has(movie.id)}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
    </div>
  );
}
