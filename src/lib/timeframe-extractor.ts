import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekOfYear);

export function extractTimeFrame(selectedTimeFrame: string | undefined) {
  return selectedTimeFrame;
}

export function getDateRangeFromTimeFrame(timeFrame: string | undefined) {
  if (!timeFrame) {
    return {};
  }

  const now = dayjs();
  let startDate: string | undefined;
  let endDate: string | undefined;

  switch (timeFrame) {
    case "today":
      startDate = now.startOf("day").toISOString();
      endDate = now.endOf("day").toISOString();
      break;
    case "yesterday":
      startDate = now.subtract(1, "day").startOf("day").toISOString();
      endDate = now.subtract(1, "day").endOf("day").toISOString();
      break;
    case "this_week":
      startDate = now.startOf("week").toISOString();
      endDate = now.endOf("week").toISOString();
      break;
    case "this_month":
      startDate = now.startOf("month").toISOString();
      endDate = now.endOf("month").toISOString();
      break;
    case "this_quarter":
      startDate = now.startOf("quarter").toISOString();
      endDate = now.endOf("quarter").toISOString();
      break;
    case "this_year":
      startDate = now.startOf("year").toISOString();
      endDate = now.endOf("year").toISOString();
      break;
    default:
      if (timeFrame.startsWith("custom:")) {
        const parts = timeFrame.replace("custom:", "").split("_");
        if (parts.length === 2) {
          startDate = dayjs(parts[0]).startOf("day").toISOString();
          endDate = dayjs(parts[1]).endOf("day").toISOString();
        }
      }
      break;
  }

  return { startDate, endDate };
}
