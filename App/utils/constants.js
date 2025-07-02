const CONSTANT = {
  MAIL_STATUS: {
    SUNNY: "晴",
    CLOUDY: "曇",
    RAINY: "雨",
  },
  STATUS_COLOR: {
    SUNNY: "#e0a800",
    CLOUDY: "rgb(153, 153, 247)",
    RAINY: "#b52a37",
  },
  END_OF_DAY: { hours: 23, minutes: 59, seconds: 59, ms: 999 },
  REGEX_MAIL: /\[週報：\s*(晴|曇|雨)\s*\/\s*[1-3]\]/,
  DATE_FORMAT: "YYYY/MM/DD",
  LITEPICKER_CONFIG: {
    singleMode: false,
    format: "YYYY/MM/DD",
    numberOfMonths: 1,
    numberOfColumns: 1,
    autoApply: false,
    showTooltip: true,
    tooltipText: {
      one: "選択日",
      other: "選択日数",
    },
    dropdowns: {
      minYear: 2020,
      maxYear: 2030,
      months: true,
      years: true,
    },
    buttonText: {
      apply: "決定",
      cancel: "キャンセル",
      previousMonth: "前月",
      nextMonth: "翌月",
    },
    lang: "ja-JP",
  },

  // No Mail HTML
  NO_MAIL_DISPLAY: `<div>No mail data</div>`,
  LIST_MAIL_HTML: `<div class="email-list" style="max-height:360px;overflow-y:auto;padding-right:8px;">`,
};

export default CONSTANT;
