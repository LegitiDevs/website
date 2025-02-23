import { SITE_CONFIG } from "./config";

let iconCache = {}

export const getItemIcon = (item_id) => {
    if (iconCache[item_id]) return iconCache[item_id]
    let trimmedID = item_id.replace(/^\w+:/, "");

    const img = `https://raw.githubusercontent.com/jacobsjo/mcicons/refs/heads/icons/item/${trimmedID}.png`;
    iconCache[item_id] = img
    return img
}

export const getOwnerName = async (uuid) => {
    const res = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
    const profile = await res.json()

    return profile.username
}

export const rehyphenateUUID = (uuid) => {
    return uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

export const getProfileData = async (access_token) => {
    const profile_res = await fetch(
        "https://mc-auth.com/api/v2/profile",
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    const profile_data = await profile_res.json();
    return profile_data
}