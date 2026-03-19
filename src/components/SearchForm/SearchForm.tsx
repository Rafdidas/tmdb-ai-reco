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
        placeholder="Search curated titles..."
        className={styles.input}
        aria-label="Search curated titles"
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}
