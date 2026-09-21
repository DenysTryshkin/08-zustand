import type { Metadata } from "next";

import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | NoteHub",
  description: "The requested NoteHub page does not exist.",
  alternates: {
    canonical: "https://08-zustand.vercel.app/404",
  },
  openGraph: {
    title: "Page Not Found | NoteHub",
    description: "The requested NoteHub page does not exist.",
    url: "https://08-zustand.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
