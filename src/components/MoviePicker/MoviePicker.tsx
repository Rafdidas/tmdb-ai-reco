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

type SpectrumItem = {
  label: string;
  value: number;
  color: string;
};

const MIN_SELECTION = 3;
const MAX_SELECTION = 5;
const SPECTRUM_COLORS = ["#00e3fd", "#bc9dff", "#ff6d8b"];
const SPECTRUM_VALUES = [88, 65, 42];

function toSpectrum(analysis: TasteAnalysis | null): SpectrumItem[] {
  if (!analysis) {
    return [];
  }

  const labels = analysis.recommendedMoods.length
    ? analysis.recommendedMoods.slice(0, 3)
    : analysis.keywords.slice(0, 3);

  return labels.map((label, index) => ({
    label,
    value: SPECTRUM_VALUES[index] ?? 50,
    color: SPECTRUM_COLORS[index] ?? "#00e3fd",
  }));
}

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

  const spectrum = useMemo(() => toSpectrum(analysis), [analysis]);
  const remainingSelections = Math.max(MIN_SELECTION - selectedMovies.length, 0);

  const handleToggleSelect = (movie: Movie) => {
    const isSelected = selectedIds.has(movie.id);

    setAnalysis(null);
    setErrorMessage("");

    if (isSelected) {
      setSelectedMovies((prev) => prev.filter((item) => item.id !== movie.id));
      return;
    }

    if (selectedMovies.length >= MAX_SELECTION) {
      alert(`최대 ${MAX_SELECTION}개까지 선택할 수 있습니다.`);
      return;
    }

    setSelectedMovies((prev) => [...prev, movie]);
  };

  const handleAnalyzeTaste = async () => {
    if (selectedMovies.length < MIN_SELECTION) {
      alert(`먼저 영화를 최소 ${MIN_SELECTION}개 선택해주세요.`);
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

  if (analysis) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.resultsHeader}>
          <div>
            <p className={styles.resultsEyebrow}>분석 완료</p>
            <h2 className={styles.resultsTitle}>AI 취향 분석 결과</h2>
          </div>
          <div className={styles.resultsActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setAnalysis(null)}>
              선택 다시 하기
            </button>
            <button type="button" className={styles.ghostButton} onClick={handleAnalyzeTaste} disabled={isLoading}>
              {isLoading ? "분석 중..." : "다시 분석하기"}
            </button>
          </div>
        </section>

        <section className={styles.analysisGrid}>
          <article className={styles.summaryCard}>
            <div className={styles.cardHeadingRow}>
              <span className={styles.cardIcon}>•</span>
              <h3 className={styles.cardTitle}>취향 서사 요약</h3>
            </div>
            <p className={styles.summaryText}>{analysis.summary}</p>
            <div className={styles.chipRow}>
              {analysis.keywords.slice(0, 4).map((keyword) => (
                <span key={keyword} className={styles.chip}>
                  {keyword}
                </span>
              ))}
              {analysis.recommendedMoods.slice(0, 2).map((mood) => (
                <span key={mood} className={styles.chipMuted}>
                  {mood}
                </span>
              ))}
            </div>
          </article>

          <aside className={styles.spectrumCard}>
            <h3 className={styles.cardTitle}>감정 스펙트럼</h3>
            <div className={styles.spectrumList}>
              {spectrum.map((item) => (
                <div key={item.label} className={styles.spectrumItem}>
                  <div className={styles.spectrumMeta}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className={styles.spectrumTrack}>
                    <span
                      className={styles.spectrumFill}
                      style={{ width: `${item.value}%`, backgroundColor: item.color, boxShadow: `0 0 14px ${item.color}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

        <section className={styles.recommendSection}>
          <div className={styles.recommendHeader}>
            <h3 className={styles.recommendTitle}>맞춤 추천 작품</h3>
            <p className={styles.recommendMeta}>{selectedMovies.length}개 작품을 기준으로 분석됨</p>
          </div>

          {analysis.recommendedMovieResults.length === 0 ? (
            <p className={styles.emptyMessage}>추천 영화를 찾지 못했습니다.</p>
          ) : (
            <div className={styles.recommendGrid}>
              {analysis.recommendedMovieResults.map((movie) => (
                <RecommendedMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

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

      <div className={styles.selectionDock}>
        <div className={styles.selectionStatus}>
          <strong>{selectedMovies.length}개 작품 선택됨</strong>
          <span>{remainingSelections > 0 ? `${remainingSelections}개 더 선택해 주세요` : "분석할 준비가 되었어요"}</span>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleAnalyzeTaste}
          disabled={isLoading || selectedMovies.length < MIN_SELECTION}
        >
          {isLoading ? "분석 중..." : "내 취향 분석하기"}
        </button>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
    </div>
  );
}
