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
  return value ? value.slice(0, 4) : "TBD";
}

function formatRuntime(value: number | null) {
  if (!value) {
    return "Runtime N/A";
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes}m`;
}

function getPrimaryCrew(movie: Awaited<ReturnType<typeof getMovieDetail>>, jobs: string[]) {
  return movie.credits.crew.find((person) => jobs.includes(person.job))?.name ?? "정보 없음";
}

function buildAiInsight(movie: Awaited<ReturnType<typeof getMovieDetail>>) {
  const genres = movie.genres.slice(0, 2).map((genre) => genre.name);
  const keywords = movie.keywords.keywords.slice(0, 2).map((keyword) => keyword.name);
  const genreText = genres.length ? genres.join(" and ") : movie.original_title;
  const keywordText = keywords.length ? keywords.join(" and ") : "emotional scale and visual ambition";

  return `Based on your preference for ${genreText}, this film stands out for its ${keywordText} and its ability to balance emotional intimacy with cosmic scale.`;
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
      <header className={styles.topBar}>
        <Link href="/" className={styles.brand}>
          Digital Curator
        </Link>
        <div className={styles.topActions}>
          <div className={styles.iconButton} aria-hidden="true">
            <span className={styles.dot} />
          </div>
          <div className={styles.avatar} aria-hidden="true">
            DC
          </div>
        </div>
      </header>

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
              Back to Recommendations
            </Link>
            {/* <span className={styles.matchBadge}>AI Match {Math.round(movie.vote_average * 10)}%</span> */}
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
                Watch Trailer
              </a>
            ) : null}
            {movie.homepage ? (
              <a href={movie.homepage} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
                Official Site
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
              <span className={styles.factLabel}>Director</span>
              <strong className={styles.factValue}>{getPrimaryCrew(movie, ["Director"])}</strong>
            </article>
            <article className={styles.factCard}>
              <span className={styles.factLabel}>Writer</span>
              <strong className={styles.factValue}>{getPrimaryCrew(movie, ["Writer", "Screenplay"])} </strong>
            </article>
            <article className={styles.factCard}>
              <span className={styles.factLabel}>Studio</span>
              <strong className={styles.factValue}>{movie.production_companies[0]?.name ?? "정보 없음"}</strong>
            </article>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <article className={styles.sidebarCard}>
            <h2 className={styles.sidebarTitle}>Cast Highlights</h2>
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
                      <span className={styles.castRole}>{person.character || "Cast"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className={styles.insightCard}>
            <p className={styles.insightEyebrow}>AI Insight</p>
            <p className={styles.insightText}>{buildAiInsight(movie)}</p>
          </article>
        </aside>
      </section>

      {similarExperiences.length ? (
        <section className={styles.relatedSection}>
          <p className={styles.sectionEyebrow}>Similar Experiences</p>
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
                      {/* <span className={styles.relatedMatch}>{Math.round(item.vote_average * 10)}% AI Match</span> */}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <footer className={styles.footer}>
        <p className={styles.footerBrand}>Digital Curator</p>
        <div className={styles.footerLinks}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>API Status</span>
          <span>Contact</span>
        </div>
        <p className={styles.footerCopy}>© 2024 Digital Curator. Powered by TMDB & OpenAI.</p>
      </footer>
    </main>
  );
}
