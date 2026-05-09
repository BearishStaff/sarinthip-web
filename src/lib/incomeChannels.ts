export const INCOME_CHANNELS = [
  { name: 'Cash',     gpRate: 0   },
  { name: 'LineMAN',  gpRate: 0.3 },
  { name: 'Shopee',   gpRate: 0.2 },
  { name: 'GrabFood', gpRate: 0.3 },
] as const;

export type ChannelName = typeof INCOME_CHANNELS[number]['name'];

export function getGpRate(channel: string): number {
  return INCOME_CHANNELS.find(c => c.name === channel)?.gpRate ?? 0;
}

export function calcNetAmount(grossAmount: number, gpRate: number): number {
  return grossAmount * (1 - gpRate);
}

export function calcGpDeduction(grossAmount: number, gpRate: number): number {
  return grossAmount * gpRate;
}
