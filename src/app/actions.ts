"use client"; // Note: This will be moved to "use server" if needed, but for now let's keep it safe. 
// Actually, in Next.js 15, we use "use server" at the top of the file for server actions.

"use server";

import { supabase } from "@/lib/supabase";
import { generateCharacters } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

export async function createWorldCupAction(config: { title: string, rounds: number, isPublic: boolean }) {
    const { data, error } = await supabase
        .from("world_cups")
        .insert([
            { title: config.title, rounds: config.rounds, is_public: config.isPublic }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function generateAndSaveCharactersAction(worldCupId: string, prompt: string, count: number) {
    // 1. Generate via Gemini
    const characters = await generateCharacters(prompt, count);

    // 2. Save to Supabase
    const { error } = await supabase
        .from("characters")
        .insert(
            characters.map((c: any) => ({
                world_cup_id: worldCupId,
                name: c.name,
                description: c.description,
                image_url: c.imageUrl
            }))
        );

    if (error) throw error;
    return characters;
}

export async function fetchPublicWorldCups() {
    const { data, error } = await supabase
        .from("world_cups")
        .select("*, characters(*)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function updateCharacterWinAction(characterId: string) {
    const { data, error } = await supabase.rpc('increment_character_wins', { char_id: characterId });
    // Note: 'increment_character_wins' would be a Postgres function. 
    // For simplicity, let's use a standard update if RLS allows.
}
