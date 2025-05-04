document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    ["speedValue", "speedUnit", "stepValue", "stepUnit"],
    (data) => {
      document.getElementById("speedValue").value = data.speedValue || 10;
      document.getElementById("speedUnit").value = data.speedUnit || "ms";
      document.getElementById("stepValue").value = data.stepValue || 5;
      document.getElementById("stepUnit").value = data.stepUnit || "px";
    }
  );
});

document.getElementById("save").addEventListener("click", () => {
  const speedValue = parseFloat(document.getElementById("speedValue").value);
  const speedUnit = document.getElementById("speedUnit").value;
  const stepValue = parseFloat(document.getElementById("stepValue").value);
  const stepUnit = document.getElementById("stepUnit").value;

  chrome.storage.sync.set(
    { speedValue, speedUnit, stepValue, stepUnit },
    () => {
      document.getElementById("status").textContent = "✅ Saved!";
      setTimeout(
        () => (document.getElementById("status").textContent = ""),
        1500
      );
    }
  );
});

document.getElementById("start").addEventListener("click", async () => {
  const speedValue = parseFloat(document.getElementById("speedValue").value);
  const speedUnit = document.getElementById("speedUnit").value;
  const stepValue = parseFloat(document.getElementById("stepValue").value);
  const stepUnit = document.getElementById("stepUnit").value;

  chrome.storage.sync.set(
    { speedValue, speedUnit, stepValue, stepUnit },
    () => {
      document.getElementById("status").textContent = "✅ Saved!";
      setTimeout(
        () => (document.getElementById("status").textContent = ""),
        1500
      );
    }
  );
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.sync.get(
    ["speedValue", "speedUnit", "stepValue", "stepUnit"],
    (data) => {
      let intervalMs =
        data.speedUnit === "fps"
          ? 1000 / (data.speedValue || 60)
          : data.speedValue || 10;

      const step = data.stepValue || 5;
      const usePercent = data.stepUnit === "%";

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: (intervalMs, step, usePercent) => {
            // 기존 인터벌 정지
            if (window.__scrollIntervalId) {
              clearInterval(window.__scrollIntervalId);
            }

            const scrollFunc = () => {
              const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
              const current = window.scrollY;

              if (current >= maxScroll) {
                clearInterval(window.__scrollIntervalId);
                window.__scrollIntervalId = null;
                return;
              }

              const stepAmount = usePercent
                ? (window.innerHeight * step) / 100
                : step;
              window.scrollBy(0, stepAmount);
            };

            window.__scrollIntervalId = setInterval(scrollFunc, intervalMs);
          },
          args: [intervalMs, step, usePercent],
        },
        () => {
          // 실행 완료 후 status 업데이트
          document.getElementById("status").textContent = "🚀 Started!";
          setTimeout(
            () => (document.getElementById("status").textContent = ""),
            1500
          );
        }
      );
    }
  );
});

document.getElementById("stop").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        if (window.__scrollIntervalId) {
          clearInterval(window.__scrollIntervalId);
          window.__scrollIntervalId = null;
        }
      },
    },
    () => {
      document.getElementById("status").textContent = "🛑 Stopped!";
      setTimeout(
        () => (document.getElementById("status").textContent = ""),
        1500
      );
    }
  );
});
