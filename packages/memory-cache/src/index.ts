import { useEffect, useRef } from 'react';
import Cache from '@lindeneg/cache';
import type { CacheConfig } from '@lindeneg/cache';
import type { EmptyObj } from '@lindeneg/types';

export default function useMemoryCache<T extends EmptyObj>(
  config?: Partial<CacheConfig<T>> | (() => Partial<CacheConfig<T>>)
) {
  const ref = useRef<Cache<T>>(
    new Cache(typeof config === 'function' ? config() : config)
  );

  useEffect(() => {
    return () => {
      const { current } = ref;
      current.destruct();
    };
  }, []);

  return { cache: ref.current };
}