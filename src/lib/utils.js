import { redirect } from "@sveltejs/kit";
import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { alerts, iconCache, usernameCache } from "./stores";
import { invalidateAll } from "$app/navigation";
import { get } from "svelte/store";
import swears from "./swears.json" with {type:"json"}

export const getItemIcon = (item_id) => {
    if (get(iconCache)[item_id]) return get(iconCache)[item_id]
    let trimmedID = item_id.replace(/^\w+:/, "");

    const img = `https://raw.githubusercontent.com/jacobsjo/mcicons/refs/heads/icons/item/${trimmedID}.png`;
    iconCache.set({...get(iconCache), [item_id]: img})
    return img
}

export const getOwnerName = async (uuid) => {
    if (get(usernameCache)[uuid]) return get(usernameCache)[uuid]
    const res = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
    const profile = await res.json()

    usernameCache.set({...get(usernameCache), [uuid]: profile.data.player.username})
    return profile.data.player.username
}

export const rehyphenateUUID = (uuid) => {
    return uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

export const showAlert = (message, level, duration) => {
    alerts.update(running => [...running, { message, level, duration }])
    setTimeout(() => { alerts.update(running => running.slice(1)) }, duration)
}

export const refreshSession = async (warn) => {
    await fetch("/api/profile/refreshSession")
    await invalidateAll()
    if (warn) showAlert("Refreshed session, Please try again.", "warning", 2000);
}

export const sanitizeText = (text) => {
    const filter = /[\x00-\x1F\x7F\u200B\u200C\u200D\u2060\u202A-\u202E\uFEFF]/g
    return text.replaceAll(filter, "")
}

export const handleError = async (status, badRequestMessage = "An error occured.") => {
    if (status === 400) return showAlert(badRequestMessage, "error", 2000)
    if (status === 401) return await refreshSession(true)
    if (status >= 500) return showAlert("The server is having some issues. Please try later", "warn", 2000)
}

const swearRegex = new RegExp(`\\b(${swears.join("|")})\\b`, "gi");
export const censorText = (text) => text.replace(swearRegex, (match) => {
    if (match.length <= 2) return match; // Skip short words

    const first = match[0];
    const last = match[match.length - 1];
    const censored = "*".repeat(match.length - 2);

    return first + censored + last;
});