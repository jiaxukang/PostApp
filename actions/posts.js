'use server';
import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState, formData) {

    const title = formData.get('title');
    const image = formData.get('image');
    const content = formData.get('content');

    let errors = [];
    if (!title || title.trim().length === 0) {
        errors.push('Invalid title');
    }

    if (!content || content.trim().length === 0) {
        errors.push('Invalid content');
    }

    if (!image || image.size === 0) {
        errors.push('Invalid image');
    }
    if (errors.length > 0) {
        return { errors };
    }

    let imageUrl;
    try {
        imageUrl = await uploadImage(image);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
    }
    await storePost({
        imageUrl: imageUrl,
        title,
        content,
        userId: 1,
    });
    revalidatePath('/feed');
    redirect('/feed');
}

export async function likePost(postId) {
    await updatePostLikeStatus(postId, 2);
    revalidatePath('/feed');
}