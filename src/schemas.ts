import { z } from 'zod';
export const generateQRSchema = z.object({
    text: z.string().min(1, "Text is required"),
    size: z.coerce.number().min(50).max(2000).default(300),
    margin: z.coerce.number().min(0).max(20).default(4),
    format: z.enum(['png', 'svg']).default('png'),
    color_dark: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid hex color").default('#000000'),
    color_light: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid hex color").default('#ffffff')
});
export type GenerateQRParams = z.infer<typeof generateQRSchema>;
