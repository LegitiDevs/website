import { getOwnerName } from '$lib/utils.js'

export const load = async ({ params }) => {
    const ownerName = await getOwnerName(params.uuid);
    return {
        page: { title: ownerName },
        player_uuid: params.uuid,
        player_name: ownerName
    }
}