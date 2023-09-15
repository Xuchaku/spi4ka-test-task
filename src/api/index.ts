export async function getValutes(url: string) {
  const response = await fetch(url);

  const valutesObj = await response.json();

  return valutesObj;
}
