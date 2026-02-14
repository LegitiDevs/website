import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { PUBLIC_API_ROOT } from '$env/static/public'
import { error } from '@sveltejs/kit'

export const load = async ({ params, fetch }) => {
    const worldDataRes = await fetch(`${PUBLIC_API_ROOT}world/${params.world} `)
    const playersRes = await fetch(`${PUBLIC_API_ROOT}players/${params.world}`)
    if (!worldDataRes.ok) error(404, { message: `Invalid world UUID.` })
    const worldData = await worldDataRes.json();
    const playersData = await playersRes.json();

    return {
        page: {
            title: worldData.name,
        },
        world: worldData,
        players: playersData
    }
}
