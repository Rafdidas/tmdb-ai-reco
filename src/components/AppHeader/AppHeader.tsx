"use client";

import { useRouter } from "next/navigation";
import styles from "./AppHeader.module.scss";

export default function AppHeader() {
  const router = useRouter();

  const handleResetHome = () => {
    window.dispatchEvent(new Event("app:reset-home"));
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button type="button" className={styles.brandButton} onClick={handleResetHome}>
          <span className={styles.title}>TMDB AI RECO</span>
        </button>
      </div>
    </header>
  );
}
