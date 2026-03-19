'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchForm.module.scss';

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultValue = searchParams.get('query') ?? '';

  const handleSubmit = (formData: FormData) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = String(formData.get('query') ?? '').trim();

    if (query) {
      params.set('query', query);
      params.delete('page');
    } else {
      params.delete('query');
      params.delete('page');
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="query"
        defaultValue={defaultValue}
        placeholder="큐레이션할 작품을 검색해 보세요"
        className={styles.input}
        aria-label="영화 검색"
      />
      <button type="submit" className={styles.button}>
        검색
      </button>
    </form>
  );
}
