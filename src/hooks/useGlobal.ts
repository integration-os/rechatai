import { proxy, useSnapshot } from 'valtio';
import { cacheValue, clearCache, getValueFromCache, safeJSON } from "../lib/utils";
import { useCallback, useEffect } from 'react';
import { devtools } from 'valtio/utils';

const initialState = {
  "user": {
    "name": "John Doe",
  }
};

const GlobalNamespace = [
  "user",
  "connection",
  "suggestions"
] as const;

const GlobalSubspace = [
  "selected"
] as const;

type GlobalNamespaceKeys = (typeof GlobalNamespace)[number];

type GlobalSubspaceKeys = (typeof GlobalSubspace)[number];

export interface UseGlobalConfig {
  persist?: boolean;
  ttl?: number;
}

type Setter = <T>(key: T, config?: UseGlobalConfig) => void;


type Utils = {
  resetKey: (key?: GlobalKeys) => void;
  availableKeys: string[];
};

export type GlobalKeys =
| [GlobalNamespaceKeys, GlobalSubspaceKeys?, string?, string?, string?]
| GlobalNamespaceKeys;

const localStateKeyStringify = (key: GlobalKeys) => {
  if (typeof key !== "string" && !Array.isArray(key)) {
    throw new Error("key must be a string or an array of strings");
  }
  
  if (Array.isArray(key)) {
    return safeJSON.stringify(key);
  }
  return safeJSON.stringify([key]);
};

export const globalState = proxy<{ [key: string]: unknown }>(initialState);
const NOTUSABLE = devtools(globalState, 'new.global.state');

export const setKey = (key: string, value: unknown) => {
    globalState[key] = value;
  };

const useGlobal = <T>(key: GlobalKeys): [T, Setter, Utils] => {
  const stringifiedKey = localStateKeyStringify(key);

  const _state = useSnapshot(globalState);
  const value = _state[stringifiedKey] as T;

  useEffect(() => {
    const process = async () => {
      const cacheValue = await getValueFromCache(stringifiedKey);
      if (!cacheValue) return;
      setKey(stringifiedKey, cacheValue);
    };
    process();
  }, [stringifiedKey]);

  const set: Setter = useCallback(
    (_value, config) => {
      setKey(stringifiedKey, _value);
      if (config?.persist) {
        cacheValue(stringifiedKey, _value, config.ttl);
      } else {
        // something should listen for these changes or you will always be out of sync until refresh.
        clearCache(stringifiedKey);
      }
    },
    [stringifiedKey]
  );

  const resetKey = (_key?: GlobalKeys) => {
    const allKeys = Object.keys(globalState);

    const keyToReset = _key || key;

    const stringifiedKey = localStateKeyStringify(keyToReset);
    const validKeys = allKeys.filter((k) => {
      const parsedKey = safeJSON.parse(k);
      return (
        stringifiedKey === k ||
        parsedKey?.find((_k: GlobalKeys) => _k === keyToReset)
      );
    });
    validKeys.forEach((k) => {
      setKey(k, undefined);
      clearCache(k);
    });
  };

  const availableKeys = Object.keys(_state);

  return [value, set, { resetKey, availableKeys }];

};

export default useGlobal;