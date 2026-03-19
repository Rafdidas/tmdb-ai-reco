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
    <article className={`${styles.card} ${selected ? styles.selected : ""}`}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => onToggleSelect(movie)}
        aria-label={selected ? `${movie.title} 선택 해제` : `${movie.title} 선택`}
      >
        {selected ? "✓" : "+"}
      </button>

      <Link href={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrap}>
          {posterUrl ? (
            <Image
              className={styles.poster}
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className={styles.emptyPoster}>이미지 없음</div>
          )}
        </div>

        <div className={styles.overlay}>
          <h2 className={styles.movieTitle}>{movie.title}</h2>
          <p className={styles.meta}>
            {movie.release_date?.slice(0, 4) || "TBD"} <span>✦</span> {movie.vote_average.toFixed(1)}
          </p>
          <p className={styles.overview}>{movie.overview || "No synopsis available."}</p>
        </div>
      </Link>
    </article>
  );
}
