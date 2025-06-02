import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ url, cookies }) => {
    if (!cookies.get("authorization.refreshToken")) {
        return redirect(302, "/api/profile/login")
    }

    const refreshRes = await fetch(`${SITE_CONFIG.API_ROOT}profile/refresh`, {
		method: "POST",
		headers: { "Refresh-Token": cookies.get("authorization.refreshToken") },
		body: JSON.stringify({ profile_uuid: cookies.get("profile.uuid") }),
	});

	if (!refreshRes.ok) return redirect(302, "/api/profile/login")
	
	const { sessionToken, refreshToken, refreshTokenExpiresAt } = await refreshRes.json()
	cookies.set("authorization.sessionToken", sessionToken, { path: "/" })
	cookies.set("authorization.refreshToken", refreshToken, { path: "/", expires: new Date(refreshTokenExpiresAt * 1000) })

	return json({ success: true })
}