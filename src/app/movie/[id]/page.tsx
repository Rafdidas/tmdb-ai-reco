import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieDetail } from "@/lib/movie";
import { getTmdbImageUrl } from "@/lib/tmdb-image";
import styles from "./page.module.scss";

type MovieDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatYear(value: string) {
  return value ? value.slice(0, 4) : "미정";
}

function formatRuntime(value: number | null) {
  if (!value) {
    return "상영 시간 정보 없음";
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}시간 ${minutes}분`;
}

function getPrimaryCrew(movie: Awaited<ReturnType<typeof getMovieDetail>>, jobs: string[]) {
  return movie.credits.crew.find((person) => jobs.includes(person.job))?.name ?? "정보 없음";
}

function buildAiInsight(movie: Awaited<ReturnType<typeof getMovieDetail>>) {
  const genres = movie.genres.slice(0, 2).map((genre) => genre.name);
  const keywords = movie.keywords.keywords.slice(0, 2).map((keyword) => keyword.name);
  const genreText = genres.length ? genres.join("와 ") : movie.original_title;
  const keywordText = keywords.length ? keywords.join("와 ") : "감정의 밀도와 시각적 스케일";

  return `${genreText} 취향을 좋아한다면, 이 작품은 ${keywordText}를 중심으로 감정적인 밀도와 거대한 스케일을 동시에 경험하게 해주는 작품입니다.`;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  const movie = await getMovieDetail(movieId).catch(() => {
    notFound();
  });

  if (!movie) {
    notFound();
  }

  const backdropUrl = movie.backdrop_path ? getTmdbImageUrl(movie.backdrop_path, "w1280") : null;
  const castHighlights = movie.credits.cast.slice(0, 3);
  const primaryGenres = movie.genres.slice(0, 2);
  const trailer = movie.videos.results.find(
    (video) => video.site === "YouTube" && ["Trailer", "Teaser"].includes(video.type),
  );
  const similarExperiences = [...movie.similar.results, ...movie.recommendations.results]
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 4);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            className={styles.backdrop}
            sizes="100vw"
          />
        ) : null}
        <div className={styles.backdropOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            <Link href="/" className={styles.backLink}>
              추천 화면으로 돌아가기
            </Link>
          </div>

          <h1 className={styles.title}>
            {movie.title}
            <span>.</span>
          </h1>

          <div className={styles.metaRow}>
            <span>{movie.vote_average.toFixed(1)} / 10</span>
            <span className={styles.metaDivider} />
            <span>{formatYear(movie.release_date)}</span>
            <span className={styles.metaDivider} />
            <span>{formatRuntime(movie.runtime)}</span>
            {primaryGenres.map((genre) => (
              <span key={genre.id} className={styles.genreChip}>
                {genre.name}
              </span>
            ))}
          </div>

          <div className={styles.heroButtons}>
            {trailer ? (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className={styles.primaryButton}
              >
                예고편 보기
              </a>
            ) : null}
            {movie.homepage ? (
              <a href={movie.homepage} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
                공식 사이트
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.mainColumn}>
          <div className={styles.copyBlock}>
            <p className={styles.sectionEyebrow}>줄거리</p>
            <p className={styles.overview}>{movie.overview || "줄거리 정보가 없습니다."}</p>
          </div>

          <div className={styles.factGrid}>
            <article className={styles.factCard}>
              <span className={styles.factLabel}>감독</span>
              <strong className={styles.factValue}>{getPrimaryCrew(movie, ["Director"])}</strong>
            </article>
            <article className={styles.factCard}>
              <span className={styles.factLabel}>각본</span>
              <strong className={styles.factValue}>{getPrimaryCrew(movie, ["Writer", "Screenplay"])} </strong>
            </article>
            <article className={styles.factCard}>
              <span className={styles.factLabel}>제작사</span>
              <strong className={styles.factValue}>{movie.production_companies[0]?.name ?? "정보 없음"}</strong>
            </article>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <article className={styles.sidebarCard}>
            <h2 className={styles.sidebarTitle}>주요 출연진</h2>
            <div className={styles.castList}>
              {castHighlights.map((person) => {
                const profileUrl = person.profile_path ? getTmdbImageUrl(person.profile_path, "w185") : null;
                return (
                  <div key={`${person.id}-${person.character}`} className={styles.castItem}>
                    <div className={styles.castAvatar}>
                      {profileUrl ? (
                        <Image src={profileUrl} alt={person.name} fill className={styles.castImage} sizes="48px" />
                      ) : (
                        <span>{person.name.slice(0, 1)}</span>
                      )}
                    </div>
                    <div>
                      <strong className={styles.castName}>{person.name}</strong>
                      <span className={styles.castRole}>{person.character || "배역 정보 없음"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className={styles.insightCard}>
            <p className={styles.insightEyebrow}>AI 인사이트</p>
            <p className={styles.insightText}>{buildAiInsight(movie)}</p>
          </article>
        </aside>
      </section>

      {similarExperiences.length ? (
        <section className={styles.relatedSection}>
          <p className={styles.sectionEyebrow}>비슷한 감상의 작품</p>
          <div className={styles.relatedGrid}>
            {similarExperiences.map((item) => {
              const posterUrl = item.poster_path ? getTmdbImageUrl(item.poster_path, "w500") : null;
              return (
                <Link key={item.id} href={`/movie/${item.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedPosterWrap}>
                    {posterUrl ? (
                      <Image src={posterUrl} alt={item.title} fill className={styles.relatedPoster} sizes="25vw" />
                    ) : (
                      <div className={styles.relatedEmpty}>이미지 없음</div>
                    )}
                    <div className={styles.relatedOverlay}>
                      <strong className={styles.relatedTitle}>{item.title}</strong>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
