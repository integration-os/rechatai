"use server";
import { withServerComponent } from "../components/hoc/withServerComponent";
import { ControlledCodeEditorWithAI } from "./controlled-code-editor-with-ai";


export const ServerControlledCodeEditorWithAI = withServerComponent(ControlledCodeEditorWithAI);