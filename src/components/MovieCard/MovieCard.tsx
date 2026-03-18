"use client";

import Image from "next/image";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb-image";
import type { Movie } from "@/types/movie";
import styles from "./MovieCard.module.scss";

type MovieCardProps = {
  movie: Movie;
  selected: boolean;
  onToggleSelect: (movie: Movie) => void;
};

export default function MovieCard({ movie, selected, onToggleSelect }: MovieCardProps) {
  const posterUrl = movie.poster_path ? getTmdbImageUrl(movie.poster_path, "w500") : null;

  return (
    <article className={styles.card}>
      <Link href={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrap}>
          {posterUrl ? (
            <Image
              className={styles.poster}
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className={styles.emptyPoster}>이미지 없음</div>
          )}
        </div>

        <div className={styles.cardBody}>
          <h2 className={styles.movieTitle}>{movie.title}</h2>
          <p className={styles.meta}>
            평점 {movie.vote_average.toFixed(1)} · 개봉일 {movie.release_date || "미정"}
          </p>
          <p className={styles.overview}>{movie.overview || "줄거리 없음"}</p>
        </div>
      </Link>

      <div className={styles.action}>
        <button
          type="button"
          className={`${styles.selectButton} ${selected ? styles.selected : ""}`}
          onClick={() => onToggleSelect(movie)}
        >
          {selected ? "선택됨" : "취향 담기"}
        </button>
      </div>
    </article>
  );
}
