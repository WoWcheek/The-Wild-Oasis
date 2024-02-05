import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: ""
            }
        }
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function login({ email, password }) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function getCurrentUser() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

const composeAvatarUrl = (imageName) =>
    `${supabaseUrl}/storage/v1/object/public/avatars/${imageName}`;

export async function updateCurrentUser({ password, fullName, avatar }) {
    let updatedUser = {};
    if (password) updatedUser = { password };
    else if (fullName) updatedUser = { data: { fullName } };

    const { data, error } = await supabase.auth.updateUser(updatedUser);
    if (error) throw new Error(error.message);

    if (!avatar) return data;

    const fileName = `avatar-${data.user.id}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    const { data: updatedAvatarData, error: updateAvatarError } =
        await supabase.auth.updateUser({
            data: { avatar: composeAvatarUrl(fileName) }
        });

    if (updateAvatarError) throw new Error(updateAvatarError.message);

    return updatedAvatarData;
}
