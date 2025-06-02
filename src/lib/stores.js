import { writable } from "svelte/store";
import SITE_CONFIG from "$lib/config.json" with { type: "json" }

export const lastPageURL = writable(SITE_CONFIG.SITE_ROOT);
export const currentPageURL = writable(SITE_CONFIG.SITE_ROOT);
export const usernameCache = writable({});
export const iconCache = writable({});
export const alerts = writable([])