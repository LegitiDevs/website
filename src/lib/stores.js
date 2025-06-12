import { writable } from "svelte/store";
import { PUBLIC_SITE_ROOT } from '$env/static/public'
import SITE_CONFIG from "$lib/config.json" with { type: "json" }

export const lastPageURL = writable(PUBLIC_SITE_ROOT);
export const currentPageURL = writable(PUBLIC_SITE_ROOT);
export const usernameCache = writable({});
export const iconCache = writable({});
export const alerts = writable([])