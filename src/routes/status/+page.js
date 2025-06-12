import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { PUBLIC_API_ROOT } from '$env/static/public'

export const load = async ({ fetch }) => {
    const res = await fetch(`${PUBLIC_API_ROOT}misc/uptime`)
    const uptime = await res.json()
    return {
        page: {
            title: "Status"
        },
        uptime: uptime
    }
}