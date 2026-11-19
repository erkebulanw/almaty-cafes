export async function checkConnection() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}ping.txt?t=${Date.now()}`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}