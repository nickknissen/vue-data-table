import { parse, stringify } from 'qs';

// https://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
  let timeout;
  return function debounced(...args) {
    const context = this;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function range(length) {
  return Array.from({ length }).map((v, k) => k + 1);
}

const qsOptions = {
  ignoreQueryPrefix: true,
  arrayFormat: 'brackets',
  sort: (a, b) => a.localeCompare(b),
};

export const qsStringify = query => stringify(query, qsOptions);
export const qsParse = query => parse(query, qsOptions);

export function cloneDeep(object) {
  if (!object) {
    return object;
  }

  return JSON.parse(JSON.stringify(object));
}

export const removeEmptyProperties = (obj) => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      removeEmptyProperties(val);
    }
    if (val === null || val === '') {
      delete obj[key]; // eslint-disable-line no-param-reassign
    }
  });

  return obj;
};

export function toQueryString(query) {
  return qsStringify(removeEmptyProperties(query));
}

export function fromQueryString(defaultQuery, queryString) {
  const urlParams = removeEmptyProperties(qsParse(queryString));

  return { ...defaultQuery, ...urlParams };
}
