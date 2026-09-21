"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NewNote } from "@/types/note";

import css from "./NoteForm.module.css";

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const handleSubmit = async (formData: FormData) => {
    const newNote: NewNote = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NewNote["tag"],
    };

    try {
      await createMutation.mutateAsync(newNote);

      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.back();
    } catch {
      return;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={(event) => {
            setDraft({
              title: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          maxLength={500}
          onChange={(event) => {
            setDraft({
              content: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(event) => {
            setDraft({
              tag: event.target.value as NewNote["tag"],
            });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {createMutation.isError && (
        <p className={css.error}>Failed to create note.</p>
      )}
    </form>
  );
};

export default NoteForm;
