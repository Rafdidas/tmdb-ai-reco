import styles from "./AppFooter.module.scss";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>TMDB AI RECO</p>
        <div className={styles.links}>
          <span>개인정보 처리방침</span>
          <span>이용약관</span>
          <span>API 상태</span>
          <span>문의하기</span>
        </div>
        <p className={styles.copy}>© 2026 TMDB AI RECO. Powered by TMDB & OpenAI.</p>
      </div>
    </footer>
  );
}
