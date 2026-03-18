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
    } else {
      params.delete('query');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="query"
        defaultValue={defaultValue}
        placeholder="영화 제목을 검색해보세요"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        검색
      </button>
    </form>
  );
} 
