import { SITE_CONFIG } from '$lib/config.js'

export const load = async ({ fetch }) => {
    const res = await fetch(`${SITE_CONFIG.API_ROOT}misc/uptime`)
    const uptime = await res.json()
    return {
        page: {
            title: "Status"
        },
        uptime: uptime
    }
}