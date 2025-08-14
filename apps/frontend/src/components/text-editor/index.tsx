import { Editor, EditorContent } from "@tiptap/react";
import "./text-editor.css";
import MenuBar from "./Menubar";
const RichtextEdiror = ({ editor }: { editor: Editor | null }) => {
  return (
    <div>
      <MenuBar editor={editor} />
      <div className="-z-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichtextEdiror;
