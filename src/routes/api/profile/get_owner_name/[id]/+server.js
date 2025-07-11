import { error, json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const labyRes = await fetch(`https://laby.net/api/v3/user/${params.id}/profile`);
    const playerData = await labyRes.json();
    if (!labyRes.ok) {
		return error(labyRes.status, playerData);
	}
    return json(playerData)
}