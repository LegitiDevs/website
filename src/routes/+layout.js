import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

export const load = async ({ fetch, data }) => {
  if (browser) {
    posthog.init(PUBLIC_POSTHOG_KEY, {
      api_host: PUBLIC_POSTHOG_HOST,
      fetch: fetch, // Use SvelteKit's fetch
      capture_pageview: false,
      capture_pageleave: false,
      capture_exceptions: true,
    });
  }
  return data;
};