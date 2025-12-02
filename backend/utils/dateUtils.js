import moment from "moment-timezone";

export const parseDateAsGMT7 = (dateString) => {
    return moment.tz(dateString, "YYYY-MM-DD", "Asia/Jakarta").toDate();
}