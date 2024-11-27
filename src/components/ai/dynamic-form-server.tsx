"use server";

import { DynamicForm, DynamicFormProps } from "./dynamic-form";

interface DynamicFormServerProps extends DynamicFormProps {
  toolCallId: string;
}

export const DynamicFormServer: React.FC<DynamicFormServerProps> = ({ fields, toolCallId }) => {
  return <DynamicForm fields={fields} toolCallId={toolCallId} />;
};
