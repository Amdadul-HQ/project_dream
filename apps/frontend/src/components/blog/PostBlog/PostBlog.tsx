"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useRichTextEditor from "@/components/text-editor/useRichTextEditor";
import RichtextEdiror from "@/components/text-editor";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { TCategories } from "@/types/categories.types";
import { FaSpinner } from "react-icons/fa";
import { createBlogPost } from "@/services/post";
import { toast } from "sonner";

// ✅ Updated Schema matching backend requirements
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    seriesName: z.string().optional(),
    seriesSelect: z.string().optional(),
    seriesOrder: z.string().optional(),
     status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"], {
      message: "Status is required",
    }).default("DRAFT"),
    scheduledAt: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    image: z.custom<FileList>(
      (files) => files instanceof FileList && files.length > 0,
      { message: "Image is required" }
    ),
    audio: z.custom<FileList>(
      (files) => files instanceof FileList && files.length > 0,
      { message: "Audio is required" }
    ),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    content: z
      .string()
      .min(1, "Content is required")
      .refine((val) => val.replace(/<p>|<\/p>|<br>/g, "").trim().length > 0, {
        message: "Content cannot be empty",
      }),
  })
  .refine((data) => !data.seriesName?.trim() || !data.seriesSelect?.trim(), {
    message: "Cannot provide both Series Name and Select Series",
    path: ["seriesSelect"],
  })
  .refine(
    (data) => {
      if (data.status === "SCHEDULED") {
        return !!data.scheduledAt;
      }
      return true;
    },
    {
      message: "Scheduled date is required when status is SCHEDULED",
      path: ["scheduledAt"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const PostBlog = ({ categoriesData }: { categoriesData: TCategories[] }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const editor = useRichTextEditor("");

  const form = useForm<FormValues>({
    // resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      excerpt: "",
      category: "",
      seriesName: "",
      seriesSelect: "",
      seriesOrder: "",
      status: "DRAFT",
      scheduledAt: "",
      metaTitle: "",
      metaDescription: "",
      image: undefined,
      audio: undefined,
      tags: [],
      content: "",
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  const selectedStatus = watch("status");

  // ✅ Sync editor content
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
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    } else {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleAudioChange = (files: FileList | null) => {
    if (files && files[0]) {
      form.setValue("audio", files, { shouldValidate: true });
      if (audioPreview) URL.revokeObjectURL(audioPreview);
      const previewUrl = URL.createObjectURL(files[0]);
      setAudioPreview(previewUrl);
    } else {
      if (audioPreview) URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
  };

  const removeAudio = () => {
    form.setValue("audio", undefined as any, { shouldValidate: true });
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioPreview(null);
  };

  // ✅ Submit Handler matching backend expectations
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    
    // Required fields
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("excerpt", data.excerpt);
    formData.append("status", data.status);
    
    // Category as JSON array string
    formData.append("categoryIds", JSON.stringify([data.category]));
    
    // Tags as JSON array string
    formData.append("tags", JSON.stringify(data.tags));
    
    // Files
    formData.append("thumbnail", data.image[0]);
    formData.append("audio", data.audio[0]);
    
    // Series logic - only one will be sent
    if (data.seriesName?.trim()) {
      formData.append("seriesname", data.seriesName.trim());
      if (data.seriesOrder) {
        formData.append("seriesOrder", data.seriesOrder);
      }
    } else if (data.seriesSelect?.trim()) {
      formData.append("seriesId", data.seriesSelect.trim());
      if (data.seriesOrder) {
        formData.append("seriesOrder", data.seriesOrder);
      }
    }
    
    // Optional meta fields
    if (data.metaTitle?.trim()) {
      formData.append("metaTitle", data.metaTitle);
    }
    if (data.metaDescription?.trim()) {
      formData.append("metaDescription", data.metaDescription);
    }
    
    // Scheduled date if status is SCHEDULED
    if (data.status === "SCHEDULED" && data.scheduledAt) {
      formData.append("scheduledAt", data.scheduledAt);
    }

    console.log("FormData submitted:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await createBlogPost(formData);
      console.log("res========>,", res);
      if (res?.success) {
        toast.success(res?.message || "Post created successfully!");
        form.reset();
        setTags([]);
        setImagePreview(null);
        setAudioPreview(null);
      } else {
        toast.error(res?.message || "Failed to create post");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog. Try again later!");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="my-5 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-5 flex-wrap mb-4">
                <h2 className="text-2xl font-bold">Create Post</h2>
                <div className="flex items-center gap-2">
                  <Link href={"/"}>
                    <Button type="button" className="bg-[#0000000D] text-black">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex items-center justify-center"
                    disabled={!form.formState.isValid || isSubmitting}
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : "Share Post"}
                  </Button>
                </div>
              </div>

              {/* Title + Category */}
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesData?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Excerpt */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of your post"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status + Scheduled Date */}
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedStatus === "SCHEDULED" && (
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Schedule Date & Time *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Series Name + Select Series + Series Order */}
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="seriesName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>New Series Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new series name"
                          {...field}
                          disabled={!!form.watch("seriesSelect")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seriesSelect"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Or Select Existing Series</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!!form.watch("seriesName")}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="series1">Series 1</SelectItem>
                          <SelectItem value="series2">Series 2</SelectItem>
                          <SelectItem value="series3">Series 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seriesOrder"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Series Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Order number"
                          {...field}
                          disabled={!form.watch("seriesName") && !form.watch("seriesSelect")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Meta Fields */}
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Meta Title (SEO)</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO title (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Meta Description (SEO)</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO description (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags *</FormLabel>
                    <div className="flex gap-2 relative">
                      <Input
                        placeholder="Enter tag"
                        className="pr-20"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
                        className="absolute right-1 top-1 h-8 cursor-pointer"
                      >
                        Add
                      </Button>
                    </div>
                    <FormMessage />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "bg-slate-100 border border-slate-200 text-black px-3 py-1.5 rounded-full font-medium flex items-center gap-2 text-sm"
                          )}
                        >
                          {tag}
                          <X
                            size={14}
                            className="cursor-pointer bg-slate-300 hover:bg-slate-500 transition-all duration-500 rounded-full size-5 p-0.5 shrink-0"
                            onClick={() => removeTag(tag)}
                          />
                        </span>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Image *</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e.target.files)}
                          className="hidden"
                        />
                        <label
                          htmlFor="profileImage"
                          className="w-full px-4 py-2 border border-dashed rounded-md shadow-xs flex items-center justify-center gap-1.5 text-sm cursor-pointer h-12 hover:bg-slate-50 hover:text-[#2F2685] transition-all duration-500"
                        >
                          <Upload size={16} />
                          <span className="font-medium">Choose Image</span>
                        </label>
                      </div>
                    </FormControl>
                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={150}
                          className="aspect-auto w-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Audio Upload */}
              <FormField
                control={form.control}
                name="audio"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Audio *</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          id="audioFile"
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleAudioChange(e.target.files)}
                          className="hidden"
                        />
                        <label
                          htmlFor="audioFile"
                          className="w-full px-4 py-2 border border-dashed rounded-md shadow-xs flex items-center justify-center gap-1.5 text-sm cursor-pointer h-12 hover:bg-slate-50 hover:text-[#2F2685] transition-all duration-500"
                        >
                          <Upload size={16} />
                          <span className="font-medium">Choose Audio</span>
                        </label>
                      </div>
                    </FormControl>
                    {audioPreview && (
                      <div className="mt-2 flex items-center gap-3">
                        <audio controls src={audioPreview} className="w-64" />
                        <X
                          size={20}
                          className="cursor-pointer bg-slate-300 hover:bg-slate-500 transition-all duration-500 rounded-full p-1 shrink-0"
                          onClick={removeAudio}
                        />
                      </div>
                    )}
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
                    <FormLabel>Content *</FormLabel>
                    <div className="mb-4">
                      {editor ? (
                        <RichtextEdiror editor={editor} />
                      ) : (
                        <div className="text-center">
                          <p className="text-base text-gray-500">Editor is loading, please wait...</p>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostBlog;