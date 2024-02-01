import supabase, { supabaseUrl } from "./supabase";

const composeImageName = (imageName) =>
    `${Math.random()}-${imageName}`.replaceAll("/", "");

const composeImagePath = (imageName) =>
    `${supabaseUrl}/storage/v1/object/public/cabin_images/${imageName}`;

export async function getCabins() {
    const { data, error } = await supabase.from("cabins").select("*");

    if (error) {
        console.error(error);
        throw new Error("Could not load the cabins data");
    }

    return data;
}

export async function createCabin(newCabin) {
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
    const imageName = composeImageName(newCabin.image[0]?.name);
    const imagePath = hasImagePath
        ? newCabin.image
        : composeImagePath(imageName);

    const { data, error } = await supabase
        .from("cabins")
        .insert([{ ...newCabin, image: imagePath }])
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Could not create a cabin");
    }

    const { error: storageError } = await supabase.storage
        .from("cabin_images")
        .upload(imageName, newCabin.image[0]);

    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.error(storageError);
        throw new Error("Could not upload image, so cabin was not created");
    }

    return data;
}

export async function editCabin(updatedCabin, id) {
    const hasImagePath = updatedCabin.image?.startsWith?.(supabaseUrl);
    const imageName = composeImageName(updatedCabin.image?.name);
    const imagePath = hasImagePath
        ? updatedCabin.image
        : composeImagePath(imageName);

    const { data, error } = await supabase
        .from("cabins")
        .update({ ...updatedCabin, image: imagePath })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Could not edit a cabin info");
    }

    if (!hasImagePath) {
        const { error: storageError } = await supabase.storage
            .from("cabin_images")
            .upload(imageName, updatedCabin.image);

        if (storageError) {
            console.error(storageError);
            throw new Error("Could not upload cabin image");
        }
    }

    return data;
}

export async function deleteCabin(id) {
    const { data, error } = await supabase.from("cabins").delete().eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Could not delete a cabin");
    }

    return data;
}
