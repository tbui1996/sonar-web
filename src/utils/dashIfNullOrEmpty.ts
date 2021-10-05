export default function dashIfNullOrEmpty(
  s: string | null | undefined
): string {
  return s != null && s ? s : '-';
}
