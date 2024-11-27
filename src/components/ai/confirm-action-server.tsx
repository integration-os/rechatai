"use server";

import { withServerComponent } from '../hoc/withServerComponent';
import { ConfirmationPrompt, ConfirmationPromptProps } from "./confirm-action";

export const ConfirmationPromptServer = withServerComponent<ConfirmationPromptProps>(ConfirmationPrompt);
