export async function triggerProcess(videoUrls) {
  const res = await fetch('/api/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-backend-secret': 'mysecret123'
    },
    body: JSON.stringify({ videoUrls })
  });

  return res.json();
}
