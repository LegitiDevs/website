import { SITE_CONFIG } from '$lib/config.js';
import { redirect } from '@sveltejs/kit';
export const load = async ({ cookies, fetch }) => {
	if (cookies.get("profile.uuid")) {
		const checkSessionRes = await fetch(`${SITE_CONFIG.API_ROOT}profile/check-session`, {
			method: "POST",
			headers: { "Session-Token": cookies.get("authorization.sessionToken") },
			body: JSON.stringify({ profile_uuid: cookies.get("profile.uuid") }),
		});

		if (!checkSessionRes.ok) {
			const refreshed = await fetch("/api/profile/refreshSession")
			if (refreshed.headers.get("location")) throw redirect(302, refreshed.headers.get("location"));
			const { success } = await refreshed.json()
			if (!success) {
				cookies.set("authorization.sessionToken", "", { path: "/" });
				cookies.set("authorization.refreshToken", "", { path: "/" });
				cookies.set("profile.uuid", "", { path: "/" });
				return {
					profile: {},
					cookies: {},
				};
			}
		}

		const isValid = await checkSessionRes.json();
		if (!isValid.success) {
			const refreshed = await fetch("/api/profile/refreshSession")
			if (refreshed.headers.get("location")) throw redirect(302, refreshed.headers.get("location"));
			const { success } = await refreshed.json()
			if (!success) {
				cookies.set("authorization.sessionToken", "", { path: "/" });
				cookies.set("authorization.refreshToken", "", { path: "/" });
				cookies.set("profile.uuid", "", { path: "/" });
				return {
					profile: {},
					cookies: {},
				};
			}
		}

		return {
			cookies: {
				profile: { uuid: cookies.get("profile.uuid") },
				authorization: {
					sessionToken: cookies.get("authorization.sessionToken"),
					refreshToken: cookies.get("authorization.refreshToken"),
				},
			},
		};
	}

	return {
		cookies: {},
	};
};
