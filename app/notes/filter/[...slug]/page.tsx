import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

const noteTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;

  const currentTag = slug[0];

  const filterName =
    currentTag === "all" || !noteTags.includes(currentTag as NoteTag)
      ? "All"
      : currentTag;

  const title = `${filterName} Notes | NoteHub`;
  const description = `Browse ${filterName.toLowerCase()} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-denys8.vercel.app/notes/filter/${currentTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;

  const currentTag = slug[0];

  const tag =
    currentTag === "all" || !noteTags.includes(currentTag as NoteTag)
      ? undefined
      : (currentTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
