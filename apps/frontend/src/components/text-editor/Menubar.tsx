// import {
//   AlignCenter,
//   AlignLeft,
//   AlignRight,
//   Bold,
//   Heading1,
//   Heading2,
//   Heading3,
//   Heading4,
//   Heading5,
//   Heading6,
//   Highlighter,
//   Italic,
//   List,
//   ListOrdered,
//   Strikethrough,
//   Quote,
//   Undo,
//   Redo,
//   Minus,
//   Underline,
// } from "lucide-react";
// import { BsJustify } from "react-icons/bs";

// import { Editor } from "@tiptap/react";
// import { Toggle } from "@/components/ui/toggle";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip component from ShadCN UI

// export default function MenuBar({ editor }: { editor: Editor | null }) {
//   if (!editor) {
//     return null;
//   }

//   const Options = [
//     {
//       icon: <Undo className="size-4" />,
//       onClick: () => editor.chain().focus().undo().run(),
//       preesed: false,
//       disabled: !editor.can().undo(), // <- invert here
//       tooltip: "Undo",
//     },
//     {
//       icon: <Redo className="size-4" />,
//       onClick: () => editor.chain().focus().redo().run(),
//       preesed: false,
//       disabled: !editor.can().redo(), // <- invert here
//       tooltip: "Redo",
//     },
//     {
//       icon: <Heading1 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
//       preesed: editor.isActive("heading", { level: 1 }),
//       tooltip: "Heading 1",
//     },
//     {
//       icon: <Heading2 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
//       preesed: editor.isActive("heading", { level: 2 }),
//       tooltip: "Heading 2",
//     },
//     {
//       icon: <Heading3 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
//       preesed: editor.isActive("heading", { level: 3 }),
//       tooltip: "Heading 3",
//     },
//     {
//       icon: <Heading4 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
//       preesed: editor.isActive("heading", { level: 4 }),
//       tooltip: "Heading 4",
//     },
//     {
//       icon: <Heading5 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
//       preesed: editor.isActive("heading", { level: 5 }),
//       tooltip: "Heading 5",
//     },
//     {
//       icon: <Heading6 className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
//       preesed: editor.isActive("heading", { level: 6 }),
//       tooltip: "Heading 6",
//     },
//     {
//       icon: <Bold className="size-4" />,
//       onClick: () => editor.chain().focus().toggleBold().run(),
//       preesed: editor.isActive("bold"),
//       tooltip: "Bold",
//     },
//     {
//       icon: <Italic className="size-4" />,
//       onClick: () => editor.chain().focus().toggleItalic().run(),
//       preesed: editor.isActive("italic"),
//       tooltip: "Italic",
//     },
//     {
//       icon: <Strikethrough className="size-4" />,
//       onClick: () => editor.chain().focus().toggleStrike().run(),
//       preesed: editor.isActive("strike"),
//       tooltip: "Strikethrough",
//     },
//     {
//       icon: <Underline className="size-4" />,
//       onClick: () => editor.chain().focus().toggleUnderline().run(),
//       preesed: editor.isActive("underline"),
//       tooltip: "Underline",
//     },
//     {
//       icon: <Quote className="size-4" />,
//       onClick: () => editor.chain().focus().toggleBlockquote().run(),
//       preesed: editor.isActive("blockquote"),
//       tooltip: "Blockquote",
//     },
//     {
//       icon: <Minus className="size-4" />,
//       onClick: () => editor.chain().focus().setHorizontalRule().run(),
//       preesed: false,
//       tooltip: "Horizontal Rule",
//     },
//     {
//       icon: <AlignLeft className="size-4" />,
//       onClick: () => editor.chain().focus().setTextAlign("left").run(),
//       preesed: editor.isActive({ textAlign: "left" }),
//       tooltip: "Align Left",
//     },
//     {
//       icon: <AlignCenter className="size-4" />,
//       onClick: () => editor.chain().focus().setTextAlign("center").run(),
//       preesed: editor.isActive({ textAlign: "center" }),
//       tooltip: "Align Center",
//     },
//     {
//       icon: <AlignRight className="size-4" />,
//       onClick: () => editor.chain().focus().setTextAlign("right").run(),
//       preesed: editor.isActive({ textAlign: "right" }),
//       tooltip: "Align Right",
//     },
//     {
//       icon: <BsJustify className="size-4" />,
//       onClick: () => editor.chain().focus().setTextAlign("justify").run(),
//       preesed: editor.isActive({ textAlign: "justify" }),
//       tooltip: "Justify",
//     },
//     {
//       icon: <List className="size-4" />,
//       onClick: () => editor.chain().focus().toggleBulletList().run(),
//       preesed: editor.isActive("bulletList"),
//       tooltip: "Bullet List",
//     },
//     {
//       icon: <ListOrdered className="size-4" />,
//       onClick: () => editor.chain().focus().toggleOrderedList().run(),
//       preesed: editor.isActive("orderedList"),
//       tooltip: "Ordered List",
//     },
//     // {
//     //   icon: <Code className="size-4" />,
//     //   onClick: () => editor.chain().focus().toggleCodeBlock().run(),
//     //   preesed: editor.isActive("codeBlock"),
//     //   tooltip: "Code Block",
//     // },
//     {
//       icon: <Highlighter className="size-4" />,
//       onClick: () => editor.chain().focus().toggleHighlight().run(),
//       preesed: editor.isActive("highlight"),
//       tooltip: "Highlight",
//     },
//   ];

//   return (
//     <div className="border rounded-md p-1 mb-1 dark:border-[#1e232e] dark:text-dark-secondary-txt text-light-secondary-txt z-50 flex items-center justify-center flex-wrap sticky top-0 bg-white shadow-sm">
//       {Options.map((option, index) => (
//         <TooltipProvider key={index}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Toggle pressed={option.preesed} onPressedChange={option.onClick} disabled={option.disabled}>
//                 {option.icon}
//               </Toggle>
//             </TooltipTrigger>
//             <TooltipContent className="bg-white dark:bg-dark-bg-secondary text-light-primary-txt dark:text-dark-primary-txt shadow-sm shadow-primary">
//               <p>{option.tooltip}</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       ))}
//     </div>
//   );
// }

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Quote,
  Undo,
  Redo,
  Minus,
  Underline,
} from "lucide-react";
import { BsJustify } from "react-icons/bs";

import { Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  // Helper to check if command is active
  const isActive = (type: string, options: any = {}) => editor.isActive(type, options);

  const options = [
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      pressed: false,
      disabled: !editor.can().undo(),
      tooltip: "Undo",
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      pressed: false,
      disabled: !editor.can().redo(),
      tooltip: "Redo",
    },
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: isActive("heading", { level: 1 }),
      tooltip: "Heading 1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: isActive("heading", { level: 2 }),
      tooltip: "Heading 2",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: isActive("bold"),
      tooltip: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: isActive("italic"),
      tooltip: "Italic",
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: isActive("underline"),
      tooltip: "Underline",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: isActive("strike"),
      tooltip: "Strikethrough",
    },
    {
      icon: <Quote className="size-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: isActive("blockquote"),
      tooltip: "Blockquote",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: isActive("highlight"),
      tooltip: "Highlight",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
      tooltip: "Align Left",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
      tooltip: "Align Center",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
      tooltip: "Align Right",
    },
    {
      icon: <BsJustify className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: editor.isActive({ textAlign: "justify" }),
      tooltip: "Justify",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: isActive("orderedList"),
      tooltip: "Ordered List",
    },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: false,
      tooltip: "Horizontal Rule",
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1 dark:border-[#1e232e] dark:text-dark-secondary-txt text-light-secondary-txt z-50 flex items-center justify-center flex-wrap sticky top-0 bg-white shadow-sm">
      {options.map((option, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={option.pressed}
                onPressedChange={option.onClick}
                disabled={option.disabled}
                className={option.pressed ? "bg-blue-500 text-white" : ""} // Add active color here
              >
                {option.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-dark-bg-secondary text-light-primary-txt dark:text-dark-primary-txt shadow-sm shadow-primary">
              <p>{option.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
