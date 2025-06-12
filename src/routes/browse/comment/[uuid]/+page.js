import SITE_CONFIG from "$lib/config.json" with { type: "json" }
import { PUBLIC_API_ROOT } from '$env/static/public'
import { getOwnerName } from '$lib/utils.js';
import { error } from '@sveltejs/kit'

export const load = async ({ params, fetch }) => {
    const commentRes = await fetch(`${PUBLIC_API_ROOT}world/comment/${params.uuid} `)
    if (!commentRes.ok) error(404, { message: `Invalid comment UUID.` })
    const comment = await commentRes.json();
    const profile_name = await getOwnerName(comment.profile_uuid);

    return {
        page: {
            title: comment.content.length > 20 ? `${comment.content.slice(0, 20)}...` : comment.content,
            navbar: "small"
        },
        comment: { ...comment, profile_name }
    }
}
