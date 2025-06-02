import "dotenv/config"
import SITE_CONFIG from "$lib/config.json" with { type: "json" };
import { redirect } from "@sveltejs/kit";
import { showAlert } from "$lib/utils.js";
const AUTH_REQ_URL =
	`https://mc-auth.com/oAuth2/authorize` +
	`?client_id=${SITE_CONFIG.MCAUTH.CLIENT_ID}` +
	`&redirect_uri=${encodeURIComponent(SITE_CONFIG.MCAUTH.REDIRECT_URI)}` +
	`&scope=profile` +
	`&response_type=code`;

export const GET = async ({ url, cookies }) => {

    if (cookies.get("authorization.sessionToken") && cookies.get("profile.uuid")) {
        const checkSessionRes = await fetch(`${SITE_CONFIG.API_ROOT}profile/check-session`, {
			method: "POST",
			headers: { "Session-Token": cookies.get("authorization.sessionToken") },
			body: JSON.stringify({ profile_uuid: cookies.get("profile.uuid") }),
		});

        if (checkSessionRes.ok) {
            const isValid = await checkSessionRes.json()
            // Ur already logged in dum dum.
            if (isValid.success) {
                return redirect(302, `/profile/${cookies.get("profile.uuid")}`);
            }
		}
    }

    const RAW_SEARCH_PARAMS = url.href.split("?")[1]
    const SEARCH_PARAMS = new URLSearchParams(RAW_SEARCH_PARAMS)

    // Client hasnt logged in yet
    if (!SEARCH_PARAMS.get("code")) return redirect(302, AUTH_REQ_URL);
    
    // Client has redirected. We got the code.
    const mcAuthPostRequestBody = {
        client_id: SITE_CONFIG.MCAUTH.CLIENT_ID,
        client_secret: process.env.MCAUTH_CLIENT_SECRET,
        code: SEARCH_PARAMS.get("code"),
        redirect_uri: SITE_CONFIG.MCAUTH.REDIRECT_URI,
        grant_type: "authorization_code"
    }

    // please give me the access token
    const mcAuthResponse = await (await fetch("https://mc-auth.com/oAuth2/token", {
		method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mcAuthPostRequestBody)
	})).json();

    if (mcAuthResponse.error) {
        showAlert("Internal error occured.", "error", 500)
        return redirect(302, `/`);
    }

    // Give the access token to the server and get the session and refresh tokens.
    const tokenResponse = await fetch(`${SITE_CONFIG.API_ROOT}profile/login`, {
        method: "POST",
        body: JSON.stringify({ access_token: mcAuthResponse.access_token })
    });
    
    // make the user confused on why they didnt log in cuz why not
    if (!tokenResponse.ok) return redirect(302, `/`)
    
    const { sessionToken, refreshToken, profile_uuid, refreshTokenExpiresAt } = await tokenResponse.json()

    cookies.set("authorization.sessionToken", sessionToken, { path: "/" })
    cookies.set("authorization.refreshToken", refreshToken, { path: "/", expires: new Date(refreshTokenExpiresAt * 1000) })
    cookies.set("profile.uuid", profile_uuid, { path: "/", expires: new Date(refreshTokenExpiresAt * 1000) })
    
    return redirect(302, `/profile/${profile_uuid}`);
}