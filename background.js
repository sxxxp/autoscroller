// background.js
class IntervalGet {
    static instance = null;
    interval = null;
    
    constructor() {
      if (IntervalGet.instance) {
        return IntervalGet.instance;
      }
      IntervalGet.instance = this;
    }
  
    getData() {
      return this.interval;
    }
  
    setData(interval) {
      this.interval = interval;
    }
  
    clearData() {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  // 메시지 리스너로 `getfunc` 호출
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const getfunc = new IntervalGet();
    if (message.action === "setData") {
      getfunc.setData(message.data);
      sendResponse({ status: 'Data saved' });
    } else if (message.action === "clearData") {
      getfunc.clearData();
      sendResponse({ status: 'Data cleared' });
    } else if (message.action === "getData") {
      sendResponse({ data: getfunc.getData() });
    }
  });
  