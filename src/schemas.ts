import { z } from 'zod';
const dotTypeSchema = z.enum(['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded']).default('square');
const cornersSquareTypeSchema = z.enum(['square', 'dot', 'extra-rounded']).nullable().optional();
const cornersDotTypeSchema = z.enum(['square', 'dot']).nullable().optional();
export const generateQRSchema = z.object({
    text: z.string().min(1, "Text is required"),
    size: z.coerce.number().min(50).max(2000).default(300),
    margin: z.coerce.number().min(0).max(20).default(4),
    format: z.enum(['png', 'svg']).default('png'),
    color_dark: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid hex color").default('#000000'),
    color_light: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid hex color").default('#ffffff'),
    dots_type: dotTypeSchema,
    corners_square_type: cornersSquareTypeSchema,
    corners_dot_type: cornersDotTypeSchema,
    logo_url: z.string().url().optional(),
    logo_margin: z.coerce.number().min(0).max(20).default(0),
    gradient_type: z.enum(['linear', 'radial']).optional(),
    gradient_color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid hex color").optional(),
    theme: z.enum(['modern', 'cyberpunk', 'classic']).optional()
});
export type GenerateQRParams = z.infer<typeof generateQRSchema>;
