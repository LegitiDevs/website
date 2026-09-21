import { writable } from "svelte/store";
import { env } from '$env/dynamic/public'
import SITE_CONFIG from "$lib/config.json" with { type: "json" }

const siteRoot = env.PUBLIC_SITE_ROOT || 'https://legiti.dev/'

export const lastPageURL = writable(siteRoot);
export const currentPageURL = writable(siteRoot);
export const usernameCache = writable({});
export const iconCache = writable({});
export const alerts = writable([])