import { z } from 'zod';
import { zEthereumAddress } from '@/lib/validation';

export const zBot = z.object({
    id: z.number().int(),
    name: z.string(),
    feedSlug: z.string(),
    walletAddress: zEthereumAddress,
    amountIn: z.string(),
    gasMultiplier: z.number(),
    slippage: z.number(),
    status: z.enum(['active', 'inactive']),
});
export type Bot = z.infer<typeof zBot>;

export const zBotCreate = zBot.omit({
    id: true,
    status: true,
});
export type BotCreate = z.infer<typeof zBotCreate>;

export const zBotUpdate = zBot.omit({
    id: true,
});
export type BotUpdate = z.infer<typeof zBotUpdate>;