'use server';

import { createAlbumLink, deleteAlbumLink } from "@/lib/album";
import { revalidatePath } from "next/cache";

export async function addAlbumLinkAction(tripId: string, title: string, url: string) {
  const album = await createAlbumLink(tripId, title, url);
  revalidatePath("/album");
  return album;
}

export async function deleteAlbumLinkAction(id: string) {
  await deleteAlbumLink(id);
  revalidatePath("/album");
}
