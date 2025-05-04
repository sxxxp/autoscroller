// Load saved setting
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["duration"], (result) => {
      document.getElementById("duration").value = result.duration || 2000;
    });
  });
  
  // Save setting
  document.getElementById("save").addEventListener("click", () => {
    const duration = parseInt(document.getElementById("duration").value, 10);
    chrome.storage.sync.set({ duration }, () => {
      document.getElementById("status").textContent = "Saved!";
      setTimeout(() => {
        document.getElementById("status").textContent = "";
      }, 1000);
    });
  });
  