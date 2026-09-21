import { redirect } from "@sveltejs/kit";
import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { alerts, iconCache, usernameCache } from "./stores";
import { invalidateAll } from "$app/navigation";
import { get } from "svelte/store";

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

export const sanitizeText = (text) => {
    const filter = /[\x00-\x1F\x7F\u200B\u200C\u200D\u2060\u202A-\u202E\uFEFF]/g
    return text.replaceAll(filter, "")
}