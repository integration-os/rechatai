import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import localforage from "localforage";
import { v4 as uuidv4 } from 'uuid';
import { format, fromUnixTime } from "date-fns";
import { customAlphabet } from 'nanoid'
import _ from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeJSON = {
  parse: (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  },

  stringify: (obj: string | string[] | object,
    replacer?:  null,
    space?: string | number
  ) => {
    try {
      return JSON.stringify(obj, replacer, space);
    } catch (e) {
      return "";
    }
  },
};

export const cacheValue = (
  key: string,
  value: any,
  ttl: number = 30 * 24 * 60 * 1000
) => {
  localforage.setItem(
    key,
    safeJSON.stringify({
      value,
      ttl: Date.now() + (ttl || 30 * 1000),
    })
  );
};

export const clearCache = (key: string) => {
  localforage.removeItem(key);
};

export const getValueFromCache = async (key: string) => {
  const value: string = (await localforage.getItem(key)) || "";
  if (!value) return;
  const { ttl, value: _value } = safeJSON.parse(value);
  if (Date.now() > ttl) {
    clearCache(key);
    return;
  }
  return _value;
};

export function generateRandomId() {
  const uuid = uuidv4();
  const last8Chars = uuid.substr(uuid.length - 8);
  return last8Chars;
}

export const formatDate = (timestamp: number): string => {
  if (!timestamp || isNaN(timestamp)) {
    return "Invalid Date";
  }
  try {
    return format(fromUnixTime(timestamp), "d MMMM yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

export function formatAmount(amount: number): string {
  const dollars = amount / 100;

  return dollars.toFixed(2);
}

export type EventIncEnvironment = "production" | "development" | "localhost";

export default function getEnvFromHost() {
  try {
    if (window?.location) {
      if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        return "localhost";
      }
    }

    const subdomain = window.location.host.split(".")[0];

    switch (subdomain) {
      case "app":
        return "production";
      default:
        return subdomain as EventIncEnvironment;
    }
  } catch (e) {
    // console.error(e);
    //This error happens if the server attempts to access `window`
    return "";
  }
}
export const createRandomUUID = () => {
  return uuidv4().split("-")[0];
};

export const getDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
};


export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return 'Invalid credentials!'
    case ResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case ResultCode.UserAlreadyExists:
      return 'User already exists, please log in!'
    case ResultCode.UserCreated:
      return 'User created, welcome!'
    case ResultCode.UnknownError:
      return 'Something went wrong, please try again!'
    case ResultCode.UserLoggedIn:
      return 'Logged in!'
  }
}

export function isConnectionKeyOwnedByUser(connectionKey: string, userId: string): boolean {
  const kebabCaseUserId = _.kebabCase(userId);
  return connectionKey.includes(userId) || connectionKey.includes(kebabCaseUserId);
}


export function getIntegrationLogoUrl(integration: string) {
  return `https://assets.buildable.dev/catalog/node-templates/${integration.toLowerCase().replace(/ /g, '-')}.svg`;
}


export function mergeCode(originalCode: string, aiEditedCode: string): string {
  const originalLines = originalCode.split('\n');
  const aiLines = aiEditedCode.split('\n');
  const mergedLines: string[] = [];
  let originalIndex = 0;

  for (let aiIndex = 0; aiIndex < aiLines.length; aiIndex++) {
    const aiLine = aiLines[aiIndex].trim();

    if (aiLine === '// ... existing code ...') {
      // Copy from original code until the next AI line
      aiIndex++;
      const nextAiLine = aiLines[aiIndex]?.trim();
      while (
        originalIndex < originalLines.length &&
        originalLines[originalIndex].trim() !== nextAiLine
      ) {
        mergedLines.push(originalLines[originalIndex]);
        originalIndex++;
      }
      aiIndex--;
    } else {
      // Add the AI's line
      mergedLines.push(aiLines[aiIndex]);
      // Advance originalIndex if lines match
      if (
        originalIndex < originalLines.length &&
        aiLines[aiIndex].trim() === originalLines[originalIndex].trim()
      ) {
        originalIndex++;
      }
    }
  }

  // Append any remaining lines from the original code
  while (originalIndex < originalLines.length) {
    mergedLines.push(originalLines[originalIndex]);
    originalIndex++;
  }

  return mergedLines.join('\n');
}