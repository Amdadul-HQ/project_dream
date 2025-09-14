// import { useEffect, useMemo } from "react";
// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Highlight from "@tiptap/extension-highlight";
// // import { createLowlight, all } from "lowlight";
// // import css from "highlight.js/lib/languages/css";
// // import js from "highlight.js/lib/languages/javascript";
// // import ts from "highlight.js/lib/languages/typescript";
// // import html from "highlight.js/lib/languages/xml";

// // const lowlight = createLowlight(all);
// // lowlight.register("html", html);
// // lowlight.register("css", css);
// // lowlight.register("js", js);
// // lowlight.register("ts", ts);

// const useRichTextEditor = (defaultContent: string | null) => {
//   const editor = useEditor({
//     extensions: useMemo(
//       () => [
//         StarterKit.configure({
//           heading: {
//             levels: [1, 2, 3, 4, 5, 6],
//           },
//           codeBlock: false,
//         }),
//         Underline,
//         // CodeBlockLowlight.configure({
//         //   lowlight,
//         // }),
//         TextAlign.configure({
//           types: ["heading", "paragraph"],
//           alignments: ["left", "center", "right", "justify"],
//         }),
//         Highlight.configure({ multicolor: true }),
//       ],
//       []
//     ),
//     content: defaultContent || "", // Initial content
//     editorProps: {
//       attributes: {
//         class: "h-screen hide-scrollbar rounded-md p-10 overflow-y-auto border focus:outline-none text-slate-950 shadow-md ",
//       },
//     },
//     immediatelyRender: false,
//   });

//   // Update the editor content whenever defaultContent changes
//   useEffect(() => {
//     if (editor && defaultContent) {
//       editor.commands.setContent(defaultContent);
//     }
//   }, [defaultContent, editor]);

//   return editor;
// };

// export default useRichTextEditor;

import { useEffect, useMemo } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";

const useRichTextEditor = (defaultContent: string | null) => {
  // Example upload function (replace with your API logic)
  const uploadImage = async (file: File): Promise<string> => {
    // Example: Convert to base64 (not recommended for large files — ideally upload to server/storage)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const editor = useEditor({
    extensions: useMemo(
      () => [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          codeBlock: false,
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
        }),
        Highlight.configure({ multicolor: true }),
        Image.configure({ allowBase64: true }), // Allow base64 images
        FileHandler.configure({
          allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          onDrop: async (editor, files, pos) => {
            const file = files[0];
            const imageUrl = await uploadImage(file);
            editor.commands.insertContentAt(pos, {
              type: "image",
              attrs: { src: imageUrl },
            });
          },
          onPaste: async (editor, files, pos) => {
            const file = files[0];
            const imageUrl = await uploadImage(file);
            // Only insert if pos is a valid number or Range
            if (typeof pos === "number" || (pos && typeof pos === "object")) {
              editor.commands.insertContentAt(pos, {
                type: "image",
                attrs: { src: imageUrl },
              });
            } else {
              // fallback: insert at current selection
              editor.commands.setImage({ src: imageUrl });
            }
          },
        }),
      ],
      []
    ),
    content: defaultContent || "",
    editorProps: {
      attributes: {
        class: "min-h-screen h-auto hide-scrollbar rounded-md p-10 overflow-y-auto border focus:outline-none text-slate-950 shadow-md ",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && defaultContent) {
      editor.commands.setContent(defaultContent);
    }
  }, [defaultContent, editor]);

  return editor;
};

export default useRichTextEditor;
