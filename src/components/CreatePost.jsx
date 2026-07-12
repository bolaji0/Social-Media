import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

const fetchCommunities = async () => {
    const { data, error } = await supabase.from("communities").select("*");
    if (error) throw new Error(error.message);
    return data;
};

const createPost = async (post, imageFile) => {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

    const { data, error } = await supabase
        .from("posts")
        .insert({ ...post, image_url: publicURLData.publicUrl });

    if (error) throw new Error(error.message);

    return data;
};

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const { user } = useAuth();

    // const { data: communities } = useQuery({
    //     queryKey: ["communities"],
    //     queryFn: fetchCommunities,
    // });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data) => createPost(data.post, data.imageFile),
    });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedFile) return;
        mutate({
            post: {
                title,
                content,
                avatar_url: user?.user_metadata.avatar_url || null,
                // community_id: communityId,
            },
            imageFile: selectedFile,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>

      <div>
        <label> Select Community</label>
        <select id="community" onChange={handleCommunityChange}>
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
    );
};

export default CreatePost;