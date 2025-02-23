import { invalidateAll } from '$app/navigation';
import { redirect } from '@sveltejs/kit'

export const load = ({ cookies }) => {
    cookies.set("MCAUTH_ACCESS_TOKEN", "", { path: "/"} )
    return redirect(302, "/");
}