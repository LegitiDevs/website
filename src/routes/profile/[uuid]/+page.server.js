import { isUUID } from '$lib/utils.js'
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const labyRes = await fetch(`https://laby.net/api/v3/user/${params.uuid}/profile`)
    if (!labyRes.ok || labyRes.status >= 400) {
        throw error(404, { message: "Player does not exist." })
    }

    const { uuid, name } = await labyRes.json();

    if (isUUID(params.uuid)) {
        throw redirect(301, `/profile/${name}`)
	}

    return {
        page: { title: name },
        profileOwnerUUID: uuid,
        profileOwnerName: name
    }
}