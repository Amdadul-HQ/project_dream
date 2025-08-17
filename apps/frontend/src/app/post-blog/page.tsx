// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { X } from "lucide-react";
// import { cn } from "@/lib/utils";
// import useRichTextEditor from "@/components/text-editor/useRichTextEditor";
// import RichtextEdiror from "@/components/text-editor";

// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   category: z.string().min(1, "Category is required"),
//   image: z.custom<FileList>((files) => files instanceof FileList && files.length > 0, {
//     message: "Image is required",
//   }),
//   tags: z.array(z.string()).min(1, "At least one tag is required"),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function PostBlog() {
//   const [tags, setTags] = useState<string[]>([]);
//   const [tagInput, setTagInput] = useState("");
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const editor = useRichTextEditor("");

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       category: "",
//       image: undefined,
//       tags: [],
//     },
//   });

//   const addTag = () => {
//     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
//       const newTags = [...tags, tagInput.trim()];
//       setTags(newTags);
//       form.setValue("tags", newTags, { shouldValidate: true });
//       setTagInput("");
//     }
//   };

//   const removeTag = (tag: string) => {
//     const newTags = tags.filter((t) => t !== tag);
//     setTags(newTags);
//     form.setValue("tags", newTags, { shouldValidate: true });
//   };

//   const handleImageChange = (files: FileList | null) => {
//     if (files && files[0]) {
//       form.setValue("image", files, { shouldValidate: true });

//       // Revoke old preview URL to avoid memory leaks
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }

//       // Create new preview
//       const previewUrl = URL.createObjectURL(files[0]);
//       setImagePreview(previewUrl);
//     } else {
//       // If no file is selected, remove preview
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//       setImagePreview(null);
//     }
//   };

//   const onSubmit = (data: FormValues) => {
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("category", data.category);
//     formData.append("image", data.image[0]);
//     data.tags.forEach((tag) => formData.append("tags[]", tag));

//     console.log("FormData submitted:", data);
//     // 🚀 Send formData to backend via fetch/axios
//   };

//   return (
//     <div className="max-w-7xl mt-5 mx-auto p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-4">Create Post</h2>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           {/* Title */}
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter title" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Category */}
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="tech">Tech</SelectItem>
//                     <SelectItem value="lifestyle">Lifestyle</SelectItem>
//                     <SelectItem value="education">Education</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Image Upload */}
//           <FormField
//             control={form.control}
//             name="image"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Upload Image</FormLabel>
//                 <FormControl>
//                   <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files)} />
//                 </FormControl>
//                 {imagePreview && (
//                   <div className="mt-2">
//                     <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
//                   </div>
//                 )}
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Tags */}
//           <FormField
//             control={form.control}
//             name="tags"
//             render={() => (
//               <FormItem>
//                 <FormLabel>Tags</FormLabel>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Enter tag"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag();
//                       }
//                     }}
//                   />
//                   <Button type="button" onClick={addTag}>
//                     Add
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {tags.map((tag) => (
//                     <span key={tag} className={cn("bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm")}>
//                       {tag}
//                       <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
//                     </span>
//                   ))}
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="p-2  mb-4">
//             {editor && (
//               <>
//                 <RichtextEdiror editor={editor} />
//               </>
//             )}

//             {!editor && (
//               <div className="text-center">
//                 <p className="text-base sm:text-md md:text-lg text-light-secondary-txt dark:text-dark-secondary-txt">
//                   Editor is loading, please wait...
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <Button type="submit" className="w-full">
//             Submit
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import useRichTextEditor from "@/components/text-editor/useRichTextEditor";
import RichtextEdiror from "@/components/text-editor";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  image: z.custom<FileList>((files) => files instanceof FileList && files.length > 0, {
    message: "Image is required",
  }),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  content: z.string().min(1, "Content is required"), // ✅ New validation for editor
});

type FormValues = z.infer<typeof formSchema>;

export default function PostBlog() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const editor = useRichTextEditor("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      image: undefined,
      tags: [],
      content: "",
    },
  });

  // Sync editor value to form
  useEffect(() => {
    if (editor) {
      const updateContent = () => {
        const html = editor.getHTML();
        form.setValue("content", html, { shouldValidate: true });
      };
      editor.on("update", updateContent);
      return () => {
        editor.off("update", updateContent);
      };
    }
  }, [editor, form]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags, { shouldValidate: true });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue("tags", newTags, { shouldValidate: true });
  };

  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      form.setValue("image", files, { shouldValidate: true });

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("image", data.image[0]);
    data.tags.forEach((tag) => formData.append("tags[]", tag));
    formData.append("content", data.content); // ✅ Add editor content

    console.log("FormData submitted:", data);
    // 🚀 Send formData to backend via fetch/axios
  };

  return (
    <div className="max-w-7xl mt-5 mx-auto p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files)} />
                </FormControl>
                {imagePreview && (
                  <div className="mt-2">
                    <Image src={imagePreview} alt="Preview" className="aspect-auto w-32 object-cover rounded-md border" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className={cn("bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm")}>
                      {tag}
                      <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rich Text Editor */}
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <div className="p-2 mb-4">
                  {editor ? (
                    <RichtextEdiror editor={editor} />
                  ) : (
                    <div className="text-center">
                      <p className="text-base sm:text-md md:text-lg text-light-secondary-txt dark:text-dark-secondary-txt">
                        Editor is loading, please wait...
                      </p>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
