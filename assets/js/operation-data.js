window.KEIJO_OPERATION_DATA = {
  version: 1,
  storageKey: "keijo-operation-snapshot-v1",
  durationMinutes: {
    min: 20,
    max: 30
  },
  busyHours: [
    { start: 7, end: 10 },
    { start: 17, end: 20 }
  ],
  outcomes: {
    regular: [
      { id: "normal", weight: 67, affectedLines: 0 },
      { id: "single", weight: 25, affectedLines: 1 },
      { id: "multiple", weight: 8, affectedLines: 2 }
    ],
    busy: [
      { id: "normal", weight: 55, affectedLines: 0 },
      { id: "single", weight: 35, affectedLines: 1 },
      { id: "multiple", weight: 10, affectedLines: 2 }
    ]
  },
  eventTypes: [
    {
      id: "passenger",
      regularWeight: 3,
      busyWeight: 8,
      delayMinutes: { min: 3, max: 8 },
      statusLabel: "部分延誤",
      reasons: [
        "因沿線車站有乘客需要救護服務，部分列車約延誤 {minutes} 分鐘。",
        "因乘客較多，上落客時間延長，部分列車約延誤 {minutes} 分鐘。",
        "因車內有乘客需要協助，部分列車約延誤 {minutes} 分鐘。"
      ]
    },
    {
      id: "equipment",
      regularWeight: 5,
      busyWeight: 4,
      delayMinutes: { min: 5, max: 12 },
      statusLabel: "部分延誤",
      reasons: [
        "因列車設備確認，部分列車約延誤 {minutes} 分鐘。",
        "因沿線車站月台設備確認，部分列車約延誤 {minutes} 分鐘。",
        "因信號設備確認，部分列車約延誤 {minutes} 分鐘。"
      ]
    },
    {
      id: "operation",
      regularWeight: 4,
      busyWeight: 5,
      delayMinutes: { min: 8, max: 15 },
      statusLabel: "服務調整",
      reasons: [
        "因調整列車間距，部分列車約延誤 {minutes} 分鐘。",
        "因前方列車延誤，部分列車約延誤 {minutes} 分鐘。",
        "因配合沿線列車運行調整，部分列車約延誤 {minutes} 分鐘。"
      ]
    }
  ]
};
