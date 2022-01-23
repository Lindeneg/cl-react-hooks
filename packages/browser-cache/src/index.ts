import { useRef } from 'react';
import useMemoryCache from '@lindeneg/memory-cache';
import LS from '@lindeneg/ls-cache';
import Cache from '@lindeneg/cache';
import type { CacheConfig } from '@lindeneg/cache';
import type { EmptyObj } from '@lindeneg/types';

type Config<T extends EmptyObj> = Omit<CacheConfig<T>, 'data'>;

LS.setPrefix('__clch__');

export default function useBrowserCache<T extends EmptyObj>(
  config?: Partial<Config<T>> | (() => Partial<Config<T>>)
) {
  const _config = useRef(typeof config === 'function' ? config() : config);
  const { cache } = useMemoryCache<T>(() => {
    const stored = LS.get<T>();
    if (stored !== null) {
      return { ..._config.current, data: stored };
    }
    return { ..._config.current };
  });

  cache.on('set', (key, value) => {
    LS.set(key, Cache.createEntry(value, _config.current?.ttl));
  });

  cache.on('remove', (key) => {
    LS.remove(key);
  });

  cache.on('clear', () => {
    LS.destroy();
  });

  cache.on('trim', (keys) => {
    LS.trim(keys);
  });

  return { cache };
}