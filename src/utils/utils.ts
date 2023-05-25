// import { format } from "date-fns";
import firebase from "firebase/app";
type Timestamp = firebase.firestore.Timestamp;

export const removeUndefinedKeys = (obj: any) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
};

export const phoneValidation = (number: string) => {
  try {
    if (
      number.substring(0, 4) === "+569" &&
      number.substring(4).length === 8 &&
      number.length === 12 &&
      Number.isInteger(Number(number))
    ) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const sortByName = (a: any, b: any) =>
  a.Nombre < b.Nombre ? -1 : a.Nombre > b.Nombre ? 1 : 0;

export const timesStampToDateFormatted = (timestamp: any) => {
  try {
    return new Intl.DateTimeFormat("cl-CL", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format(timestamp);
  } catch (e) {
    return "timestamp inválido";
  }
};

export const timesStampFormattedsimple = (timestamp: any) => {
  try {
    return new Intl.DateTimeFormat("cl-CL", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour12: false,
    }).format(timestamp);
  } catch (e) {
    return "timestamp inválido";
  }
};

export const timeStampToDate = (timeStamp?: any): Date => {
  if (timeStamp) return (timeStamp as Timestamp).toDate();
  return new Date();
};

export const cleanString = (value: string): string => {
  let newValue = `${value}`;
  newValue = newValue.toLowerCase();
  newValue = newValue.replace(/á/gi, "a");
  newValue = newValue.replace(/é/gi, "e");
  newValue = newValue.replace(/í/gi, "i");
  newValue = newValue.replace(/ó/gi, "o");
  newValue = newValue.replace(/ú/gi, "u");
  return newValue;
};

export const exportToCsv = (
  filename: string,
  rows: object[],
  headers: string[],
  headersAs?: string[]
): void => {
  if (!rows || !rows.length) {
    return;
  }
  const separator: string = ",";

  if (headersAs) {
    if (headers.length !== headersAs.length) {
      throw new Error("headers and headersAs must be equal length");
    }
  }
  const columHearders = headers;

  const csvContent =
    "sep=,\n" +
    (headersAs ? headersAs.join(separator) : columHearders.join(separator)) +
    "\n" +
    rows
      .map((row: any, i) => {
        return columHearders
          .map((k) => {
            let cell = k.includes(".")
              ? resolve(k, row)
              : row[k] === null || row[k] === undefined
              ? ""
              : row[k];
            if (!cell) {
              cell = "";
            }
            if (cell instanceof firebase.firestore.Timestamp) {
              cell = (cell as firebase.firestore.Timestamp)
                .toDate()
                .toLocaleString();
            } else if (cell instanceof Date) {
              cell = cell.toLocaleString();
            } else {
              cell = cell.toString().replace(/"/g, '""');
            }

            cell = cell.replace(/á/gi, "a");
            cell = cell.replace(/é/gi, "e");
            cell = cell.replace(/í/gi, "i");
            cell = cell.replace(/ó/gi, "o");
            cell = cell.replace(/ú/gi, "u");
            cell = cell.replace(/ñ/gi, "n");

            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  if ((navigator as any).msSaveBlob) {
    // In case of IE 10+
    (navigator as any).msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export function resolve(path: string, obj: any) {
  return path.split(".").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj);
}
