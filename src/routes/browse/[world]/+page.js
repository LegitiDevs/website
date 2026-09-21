import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

const apiRoot = env.PUBLIC_API_ROOT || 'https://api.legiti.dev/'

export const load = async ({ params, fetch }) => {
    const worldDataRes = await fetch(`${apiRoot}world/${params.world} `)
    const playersRes = await fetch(`${apiRoot}players/${params.world}`)
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
