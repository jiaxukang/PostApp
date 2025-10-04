"use client";
import FormSubmit from "./form-submit";
import { useFormState } from "react-dom";

export default function PostForm({ action }) {
    const [state, fromAction] = useFormState(action, {});
    return (
        <>
            <h1>Create a new post</h1>
            <form action={fromAction}>
                <p className="form-control">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" />
                </p>
                <p className="form-control">
                    <label htmlFor="image">Image URL</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id="image"
                        name="image"
                    />
                </p>
                <p className="form-control">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" rows="5" />
                </p>
                <p className="form-actions">
                    <FormSubmit />
                </p>
                {state.errors && (
                    <ul className='form-errors'>
                        {state.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </form>
        </>
    );
}