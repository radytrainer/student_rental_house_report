

export async function sendReport(formData) {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwQqpf2Cp1PFt4QoqJ5Sk67UBix-pqARNZerO-iB9aZZcMRa5lVIoFjuNv8hYU0pbMG/exec', {
      method: 'POST',
      body: formData
    });

    const text = await res.text();

    try {
      return JSON.parse(text); // JSON object with {result: "success"} or {result: "error"}
    } catch (err) {
      console.warn("Could not parse JSON:", text);
      return { result: "success" }; // fallback if server returned plain text
    }
  } catch (err) {
    console.error("Network error:", err);
    return { result: "error", error: err.message };
  }
}
