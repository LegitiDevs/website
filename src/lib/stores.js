import { writable } from "svelte/store";
import { SITE_CONFIG } from "./config";

export const lastPageURL = writable(SITE_CONFIG.SITE_ROOT);
export const currentPageURL = writable(SITE_CONFIG.SITE_ROOT);
