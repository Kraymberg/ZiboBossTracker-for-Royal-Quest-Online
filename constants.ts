
import { ArchiveEntry } from './types';

export const MIMIC_LOGO = "https://i.ibb.co/pjPBYvsf/sticker.webp";

export const ZIBO_GIFS = [
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDFpZHF4eGx6ZHZsYWE3bWY4Mm0wa3Zid3hsejRobjVia2EybTZlcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/jNu6W1TcDU6CwW50bv/giphy.gif",
  "https://i.ibb.co/ns2CCW5h/ezgif.gif"
];

export const VTP_OFFSETS = [15, 30, 40, 60, 70, 85, 100, 115, 120]; 

export const MASTER_CD_OFFSETS = [
  { range: [0, 2], label: "0-2", cd: 80, color: "text-slate-400" },
  { range: [2, 4], label: "2-4", cd: 100, color: "text-slate-400" },
  { range: [4, 6], label: "4-6", cd: 0, color: "text-slate-400" },
  { range: [6, 8], label: "6-8", cd: 20, color: "text-red-500" },
  { range: [8, 10], label: "8-10", cd: 40, color: "text-slate-400" },
  { range: [10, 12], label: "10-12", cd: 60, color: "text-slate-400" },
  { range: [12, 14], label: "12-14", cd: 80, color: "text-slate-400" },
  { range: [14, 16], label: "14-16", cd: 100, color: "text-yellow-500" },
  { range: [16, 18], label: "16-18", cd: 120, color: "text-slate-400" },
  { range: [18, 20], label: "18-20", cd: 20, color: "text-slate-400" },
  { range: [20, 22], label: "20-22", cd: 40, color: "text-slate-400" },
  { range: [22, 24], label: "22-0", cd: 60, color: "text-green-500" },
];

export const LOCATIONS = [
  "Северный кабук",
  "Хабул",
  "Алатика",
  "Морозная длань",
  "Пустошь ветров"
];

export const ROTATION_DATA = [
  { duration: 10, locations: ["Пустошь ветров", "Хабул", "Алатика"] },
  { duration: 10, locations: ["Пустошь ветров", "Хабул", "Алатика"] },
  { duration: 10, locations: ["Северный кабук", "Алатика", "Морозная длань"] },
  { duration: 10, locations: ["Алатика", "Хабул"] },
  { duration: 10, locations: ["Северный кабук", "Алатика"] },
  { duration: 10, locations: ["Северный кабук", "Алатика", "Морозная длань"] },
  { duration: 10, locations: ["Пустошь ветров", "Хабул", "Морозная длань"] },
  { duration: 10, locations: ["Хабул"] },
  { duration: 10, locations: ["Пустошь ветров", "Хабул", "Северный кабук"] },
  { duration: 10, locations: ["Алатика", "Морозная длань"] },
  { duration: 10, locations: ["Пустошь ветров", "Алатика", "Хабул"] },
  { duration: 10, locations: ["Северный кабук", "Алатика", "Хабул", "Морозная длань"] }
];

export const CYCLE_MAP: Record<string, string> = {
  "Пустошь ветров": "Алатика",
  "Алатика": "Морозная длань",
  "Морозная длань": "Хабул",
  "Хабул": "Северный кабук",
  "Северный кабук": "Пустошь ветров"
};

export const INITIAL_CHAT_HISTORY: ArchiveEntry[] = [
  {
    "id": "U5mRf72oo7zMcyCMa41M",
    "time": "2026-02-15T17:32:51",
    "source": "manual",
    "addedBy": "Asap",
    "type": "death",
    "location": "Пустошь ветров"
  },
  {
    "id": "pE4IZWRnGKOVHmFMUq7j",
    "source": "manual",
    "time": "2026-02-15T17:10:00",
    "addedBy": "Asap",
    "location": "Пустошь ветров",
    "type": "sight"
  },
  {
    "id": "dv2vR2ZwbnG8CErnpYLO",
    "respawn": {
      "location": "Северный кабук",
      "time": "09:03:18",
      "date": "2026-02-15",
      "isTimeApproximate": false,
      "isUnknown": true
    },
    "source": "manual",
    "time": "2026-02-15T03:03:18",
    "location": "Морозная длань",
    "type": "death"
  },
  {
    "id": "2DBva6bJnuFf3zBuH0Lo",
    "source": "manual",
    "location": "Хабул",
    "respawn": {
      "time": "02:54:30",
      "isUnknown": false,
      "date": "2026-02-15",
      "location": "Морозная длань",
      "isTimeApproximate": false
    },
    "time": "2026-02-14T18:52:55",
    "type": "death"
  },
  {
    "id": "5xmijKLXZHmRowR6Js6w",
    "location": "Пустошь ветров",
    "time": "2026-02-14T11:52:07",
    "source": "manual",
    "respawn": {
      "isTimeApproximate": false,
      "isUnknown": false,
      "time": "18:37:30",
      "date": "2026-02-14",
      "location": "Хабул"
    },
    "type": "death"
  },
  {
    "id": "Es7hSJ1cTLydormbypvO",
    "location": "Морозная длань",
    "source": "manual",
    "type": "death",
    "time": "2026-02-14T05:26:00",
    "respawn": {
      "date": "2026-02-14",
      "time": "11:40:30",
      "location": "Пустошь ветров",
      "isTimeApproximate": false,
      "isUnknown": false
    }
  },
  {
    "id": "jqTOKwSM6wgzNuDOJR9y",
    "time": "2026-02-13T21:49:55",
    "location": "Алатика",
    "source": "manual",
    "type": "death",
    "respawn": {
      "isTimeApproximate": false,
      "date": "2026-02-14",
      "time": "05:26:00",
      "isUnknown": true,
      "location": "Морозная длань"
    }
  },
  {
    "id": "meRDon3wcdXVwoK8imWL",
    "type": "death",
    "respawn": {
      "isUnknown": false,
      "location": "Алатика",
      "time": "21:26:30",
      "date": "2026-02-13",
      "isTimeApproximate": false
    },
    "source": "manual",
    "time": "2026-02-13T15:19:11",
    "location": "Хабул"
  },
  {
    "id": "ZOO3dqClipTESldCkiUV",
    "time": "2026-02-12T21:43:13",
    "type": "death",
    "location": "Хабул",
    "source": "manual",
    "respawn": {
      "date": "2026-02-13",
      "time": "03:43:13",
      "isTimeApproximate": false,
      "isUnknown": true,
      "location": "Северный кабук"
    }
  },
  {
    "id": "qRK6gJgVgzsqzPybeWgv",
    "type": "death",
    "source": "manual",
    "time": "2026-02-12T14:21:12",
    "respawn": {
      "isUnknown": false,
      "location": "Хабул",
      "time": "21:35:30",
      "date": "2026-02-12",
      "isTimeApproximate": false
    },
    "location": "Пустошь ветров"
  },
  {
    "id": "cBR0bVuBahWfMRM3uvK4",
    "location": "Хабул",
    "source": "manual",
    "time": "2026-02-12T06:18:20",
    "type": "death",
    "respawn": {
      "isUnknown": false,
      "date": "2026-02-12",
      "isTimeApproximate": false,
      "time": "14:13:20",
      "location": "Пустошь ветров"
    }
  },
  {
    "id": "Y2mFOvrT9shwFkYNt9CI",
    "respawn": {
      "time": "05:50:00",
      "isUnknown": false,
      "date": "2026-02-12",
      "isTimeApproximate": true,
      "location": "Хабул"
    },
    "time": "2026-02-11T21:49:13",
    "location": "Пустошь ветров",
    "type": "death",
    "source": "manual"
  },
  {
    "id": "wCFxB2v1hNa6E7pNSkPt",
    "time": "2026-02-11T14:08:11",
    "location": "Алатика",
    "source": "manual",
    "type": "death",
    "respawn": {
      "isTimeApproximate": false,
      "date": "2026-02-11",
      "location": "Пустошь ветров",
      "time": "21:43:30",
      "isUnknown": false
    }
  },
  {
    "id": "spPAO1rxt69738Ml7f0U",
    "source": "manual",
    "type": "sight",
    "location": "Алатика",
    "time": "2026-02-11T13:52:05"
  },
  {
    "id": "cYCz57vLUVqqAqUntSzd",
    "respawn": {
      "time": "06:24:05",
      "isTimeApproximate": false,
      "date": "2026-02-11",
      "location": "Северный кабук",
      "isUnknown": true
    },
    "source": "manual",
    "type": "death",
    "location": "Хабул",
    "time": "2026-02-11T00:24:05"
  },
  {
    "id": "saMkVpzlkKjXuI9QfWq7",
    "type": "death",
    "location": "Алатика",
    "source": "manual",
    "time": "2026-02-10T16:33:44",
    "respawn": {
      "location": "Хабул",
      "date": "2026-02-11",
      "time": "00:12:05",
      "isUnknown": false,
      "isTimeApproximate": false
    }
  },
  {
    "id": "cEQYqEMOGKFNmm40GZ3n",
    "location": "Алатика",
    "source": "manual",
    "type": "sight",
    "time": "2026-02-10T16:20:27"
  },
  {
    "id": "G4SAMVwMpGU92s61LujV",
    "source": "manual",
    "respawn": {
      "location": "Северный кабук",
      "date": "2026-02-10",
      "time": "08:32:59",
      "isTimeApproximate": false,
      "isUnknown": true
    },
    "location": "Северный кабук",
    "type": "death",
    "time": "2026-02-10T02:32:59"
  },
  {
    "id": "7q0ZNSa5JMF3h33dzpX2",
    "type": "death",
    "time": "2026-02-10T00:24:05",
    "location": "Хабул",
    "source": "manual"
  },
  {
    "id": "RkgPhShzS3EW1RilPjtX",
    "time": "2026-02-09T18:53:34",
    "type": "death",
    "source": "manual",
    "respawn": {
      "location": "Северный кабук",
      "isUnknown": false,
      "time": "02:18:00",
      "isTimeApproximate": true,
      "date": "2026-02-10"
    },
    "location": "Хабул"
  },
  {
    "id": "l83rfTACAoi6VNtrWD9J",
    "time": "2026-02-09T11:00:51",
    "location": "Алатика",
    "source": "manual",
    "respawn": {
      "isUnknown": false,
      "date": "2026-02-09",
      "location": "Хабул",
      "time": "18:45:01",
      "isTimeApproximate": false
    },
    "type": "death"
  },
  {
    "id": "gKwz6Z9GEaWHOZZxlIrW",
    "time": "2026-02-09T04:28:23",
    "source": "manual",
    "location": "Хабул",
    "type": "death",
    "respawn": {
      "isTimeApproximate": false,
      "time": "10:40:03",
      "date": "2026-02-09",
      "location": "Алатика",
      "isUnknown": false
    }
  },
  {
    "id": "b2bpaT7FQY659af30XGm",
    "respawn": {
      "isUnknown": false,
      "time": "04:05:35",
      "isTimeApproximate": true,
      "date": "2026-02-09",
      "location": "Хабул"
    },
    "source": "manual",
    "location": "Алатика",
    "time": "2026-02-08T20:21:35",
    "type": "death"
  },
  {
    "id": "vgwV6HZjpYhuq4hnc3BL",
    "type": "death",
    "location": "Морозная длань",
    "respawn": {
      "time": "20:13:30",
      "location": "Алатика",
      "date": "2026-02-08",
      "isTimeApproximate": false,
      "isUnknown": false
    },
    "time": "2026-02-08T12:28:59",
    "source": "manual"
  },
  {
    "id": "5fzSqxnj5tiHHAm7CU1i",
    "source": "manual",
    "time": "2026-02-08T12:21",
    "type": "sight",
    "location": "Морозная длань"
  },
  {
    "id": "baZlIRGRKJhFiDzJVpnT",
    "respawn": {
      "isTimeApproximate": false,
      "date": "2026-02-08",
      "isUnknown": true,
      "location": "Северный кабук",
      "time": "12:05:00"
    },
    "type": "death",
    "time": "2026-02-08T06:05",
    "source": "manual",
    "location": "Северный кабук"
  },
  {
    "id": "ARrP37nuTMzE2a4G22ho",
    "source": "manual",
    "time": "2026-02-08T04:28:22",
    "location": "Хабул",
    "type": "death"
  },
  {
    "id": "RSmGJde9XZD5eUeJSdvg",
    "respawn": {
      "isUnknown": false,
      "time": "04:43:00",
      "date": "2026-02-08",
      "isTimeApproximate": true,
      "location": "Северный кабук"
    },
    "location": "Пустошь ветров",
    "type": "death",
    "time": "2026-02-07T22:43:00",
    "source": "manual"
  },
  {
    "id": "vkh5PAzy09JGRM6RO0K5",
    "type": "death",
    "location": "Северный кабук",
    "time": "2026-02-07T16:01:11",
    "respawn": {
      "location": "Пустошь ветров",
      "time": "22:34:00",
      "date": "2026-02-07",
      "isTimeApproximate": false,
      "isUnknown": false
    }
  },
  {
    "id": "SfLKHas3TIB6R0H0oZ0v",
    "location": "Северный кабук",
    "type": "sight",
    "time": "2026-02-07T15:40:00"
  },
  {
    "id": "Sop5jz77d4t3YwmN5Dlk",
    "time": "2026-02-07T01:14:51",
    "respawn": {
      "time": "07:14:51",
      "isTimeApproximate": false,
      "date": "2026-02-07",
      "location": "Северный кабук",
      "isUnknown": true
    },
    "type": "death",
    "location": "Пустошь ветров"
  },
  {
    "id": "vfx2TcEG6qIOt33jHuZ9",
    "time": "2026-02-06T17:11:52",
    "location": "Северный кабук",
    "type": "death",
    "respawn": {
      "isTimeApproximate": false,
      "location": "Пустошь ветров",
      "time": "00:57:00",
      "date": "2026-02-07",
      "isUnknown": false
    }
  },
  {
    "id": "dG6B4hII7cRUid3ClRUz",
    "time": "2026-02-06T10:27:23",
    "type": "death",
    "respawn": {
      "time": "16:52:00",
      "isTimeApproximate": false,
      "location": "Северный кабук",
      "isUnknown": false,
      "date": "2026-02-06"
    },
    "location": "Хабул"
  },
  {
    "id": "Y92sS9eVxAp8rXdmjkMw",
    "location": "Морозная длань",
    "time": "2026-02-06T03:02:51",
    "type": "death",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Хабул",
      "time": "09:08:20",
      "date": "2026-02-06",
      "isUnknown": false
    }
  },
  {
    "id": "gKB9RbW7btTUacteE0uC",
    "location": "Северный кабук",
    "time": "2026-02-05T18:39:57",
    "respawn": {
      "isTimeApproximate": false,
      "location": "Морозная длань",
      "isUnknown": false,
      "time": "02:43:00",
      "date": "2026-02-06"
    },
    "type": "death"
  },
  {
    "id": "YqUhrl6mbDIz9vx2K9rt",
    "type": "death",
    "respawn": {
      "date": "2026-02-05",
      "isUnknown": false,
      "isTimeApproximate": false,
      "time": "18:18:00",
      "location": "Северный кабук"
    },
    "location": "Хабул",
    "time": "2026-02-05T11:57:18"
  },
  {
    "id": "hdkv8YrdrKQzoksiMLUj",
    "respawn": {
      "isUnknown": false,
      "isTimeApproximate": false,
      "date": "2026-02-05",
      "location": "Хабул",
      "time": "11:43:00"
    },
    "type": "death",
    "location": "Морозная длань",
    "time": "2026-02-05T04:16:39"
  },
  {
    "id": "xc4fioA2I5BjYyP2UDBj",
    "time": "2026-02-04T20:56:44",
    "respawn": {
      "isTimeApproximate": true,
      "date": "2026-02-05",
      "time": "04:00:00",
      "location": "Морозная длань",
      "isUnknown": false
    },
    "type": "death",
    "location": "Алатика"
  },
  {
    "id": "ngJwl5ZMYMzabJiXQxS4",
    "type": "death",
    "respawn": {
      "isUnknown": false,
      "isTimeApproximate": false,
      "date": "2026-02-04",
      "location": "Алатика",
      "time": "20:45:00"
    },
    "location": "Пустошь ветров",
    "time": "2026-02-04T14:35:51"
  },
  {
    "id": "xGbISAiEKvQQ7cAetpLT",
    "location": "Алатика",
    "respawn": {
      "time": "14:25:01",
      "location": "Пустошь ветров",
      "isTimeApproximate": false,
      "isUnknown": false,
      "date": "2026-02-04"
    },
    "time": "2026-02-04T06:30:32",
    "type": "death"
  },
  {
    "id": "rH6GgBR89ogewT4xjphc",
    "type": "death",
    "respawn": {
      "location": "Алатика",
      "isTimeApproximate": true,
      "isUnknown": false,
      "time": "06:10:00",
      "date": "2026-02-04"
    },
    "time": "2026-02-03T22:57:01",
    "location": "Северный кабук"
  },
  {
    "id": "mYmY7GpIxSV9bYzsxgkv",
    "location": "Пустошь ветров",
    "respawn": {
      "location": "Северный кабук",
      "isUnknown": false,
      "isTimeApproximate": false,
      "date": "2026-02-03",
      "time": "22:41:00"
    },
    "time": "2026-02-03T16:06:33",
    "type": "death"
  },
  {
    "id": "l8evJunGhwcrCB7FTfQW",
    "time": "2026-02-03T16:00:00",
    "location": "Пустошь ветров",
    "type": "sight"
  },
  {
    "id": "W7iddFWvSGzBOThCCHXc",
    "location": "Сервер",
    "maintEnd": "2026-02-03T15:45:00",
    "type": "maintenance",
    "maintStart": "2026-02-03T08:00:00",
    "time": "2026-02-03T15:45:00"
  },
  {
    "id": "WddJXgyPknZXUSt78aMs",
    "location": "Хабул",
    "time": "2026-02-03T04:33:31",
    "type": "death"
  },
  {
    "id": "jkzw5as4LqRetNaBKTkc",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Хабул",
      "isUnknown": false,
      "date": "2026-02-03",
      "time": "03:57:00"
    },
    "type": "death",
    "time": "2026-02-02T21:14:26",
    "location": "Алатика"
  },
  {
    "id": "vkpFpP1IoJxSRAdZ00R5",
    "location": "Морозная длань",
    "time": "2026-02-02T14:07:51",
    "respawn": {
      "isTimeApproximate": false,
      "date": "2026-02-03",
      "location": "Алатика",
      "isUnknown": false,
      "time": "21:02:00"
    },
    "type": "death"
  },
  {
    "id": "lXQPh8NzYPFiOEwvo7Vc",
    "type": "sight",
    "location": "Морозная длань",
    "time": "2026-02-02T13:56:31"
  },
  {
    "id": "XDEz48NFCs6bDk263eNk",
    "location": "Морозная длань",
    "type": "death",
    "respawn": {
      "date": "2026-02-01",
      "location": "Северный кабук",
      "isUnknown": false,
      "time": "23:08:00",
      "isTimeApproximate": false
    },
    "time": "2026-02-01T16:33:58"
  },
  {
    "id": "TUz8M3k00uzynu6BddVI",
    "location": "Алатика",
    "time": "2026-02-01T08:41:06",
    "respawn": {
      "isTimeApproximate": false,
      "time": "16:22:00",
      "date": "2026-02-01",
      "location": "Морозная длань",
      "isUnknown": false
    },
    "type": "death"
  },
  {
    "id": "zGWkCxR6jZh3v2Wi7hWN",
    "location": "Пустошь ветров",
    "time": "2026-02-01T01:50:16",
    "respawn": {
      "time": "08:25:00",
      "date": "2026-02-01",
      "isUnknown": false,
      "isTimeApproximate": true,
      "location": "Алатика"
    },
    "type": "death"
  },
  {
    "id": "nrXtfTLZEDMZ7qMfOH8V",
    "location": "Морозная длань",
    "time": "2026-01-31T18:06:53",
    "type": "death",
    "respawn": {
      "date": "2026-02-01",
      "isUnknown": false,
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "time": "01:40:53"
    }
  },
  {
    "id": "oOKLGflppvRNk3E6R0Nj",
    "type": "death",
    "time": "2026-01-31T11:19:03",
    "respawn": {
      "location": "Морозная длань",
      "date": "2026-01-31",
      "time": "17:53:58",
      "isUnknown": false,
      "isTimeApproximate": false
    },
    "location": "Хабул"
  },
  {
    "id": "QPW4B2phcofFEunUMRgO",
    "type": "death",
    "time": "2026-01-31T03:37:36",
    "respawn": {
      "location": "Хабул",
      "time": "11:08:00",
      "isTimeApproximate": false,
      "date": "2026-01-31",
      "isUnknown": false
    },
    "location": "Морозная длань"
  },
  {
    "id": "IGHigVgTa25hsTCuzjsj",
    "type": "sight",
    "location": "Пустошь ветров",
    "time": "2026-01-31T01:45:00"
  },
  {
    "id": "fuNoebLDIAlnHo24wob3",
    "type": "death",
    "location": "Алатика",
    "respawn": {
      "isTimeApproximate": true,
      "isUnknown": false,
      "time": "03:16:00",
      "date": "2026-01-31",
      "location": "Морозная длань"
    },
    "time": "2026-01-30T20:32:18"
  },
  {
    "id": "XVGYlhQkcHZ88ISXLg0i",
    "respawn": {
      "isUnknown": false,
      "location": "Алатика",
      "isTimeApproximate": false,
      "date": "2026-01-30",
      "time": "20:19:23"
    },
    "location": "Северный кабук",
    "type": "death",
    "time": "2026-01-30T12:37:02"
  },
  {
    "id": "BjtXtr0Qds2xsBCCc99n",
    "time": "2026-01-30T12:16:00",
    "type": "sight",
    "location": "Северный кабук"
  },
  {
    "id": "AVYLZ084PbdMAnV4EdOe",
    "time": "2026-01-29T14:37:22",
    "type": "death",
    "location": "Морозная длань",
    "respawn": {
      "location": "Хабул",
      "isUnknown": false,
      "time": "22:28:00",
      "isTimeApproximate": false,
      "date": "2026-01-29"
    }
  },
  {
    "id": "p7XTkT8z5CY5r0JACQyT",
    "respawn": {
      "isTimeApproximate": false,
      "location": "Хабул",
      "isUnknown": false,
      "time": "23:00:00",
      "date": "2026-01-28"
    },
    "type": "death",
    "location": "Морозная длань",
    "time": "2026-01-28T15:48:23"
  },
  {
    "id": "s0T1HJfQjWcil4c9gIM6",
    "type": "death",
    "respawn": {
      "isTimeApproximate": true,
      "isUnknown": false,
      "time": "18:07:00",
      "date": "2026-01-27",
      "location": "Алатика"
    },
    "time": "2026-01-27T11:47:38",
    "location": "Северный кабук"
  },
  {
    "id": "pjt0FGARKFDa4Z7aGuuk",
    "location": "Северный кабук",
    "time": "2026-01-22T23:03:00",
    "type": "sight"
  },
  {
    "id": "rhs57TvWSVcx4OR9yEAX",
    "location": "Алатика",
    "time": "2026-01-21T23:49:00",
    "type": "sight"
  },
  {
    "id": "THeCyzWw32Q99frESFcP",
    "time": "2026-01-21T16:57:31",
    "respawn": {
      "location": "Алатика",
      "isUnknown": false,
      "time": "23:49:00",
      "isTimeApproximate": true,
      "date": "2026-01-21"
    },
    "location": "Пустошь ветров",
    "type": "death"
  },
  {
    "id": "L1tDb5mbx9L2Tc54N2E1",
    "type": "sight",
    "time": "2026-01-21T16:47:00",
    "location": "Пустошь ветров"
  },
  {
    "id": "1RybdgqQBBepkdvV0glt",
    "type": "maintenance",
    "location": "Сервер",
    "maintStart": "2026-01-19T08:00:00",
    "maintEnd": "2026-01-20T15:45:00",
    "time": "2026-01-20T15:45:00"
  },
  {
    "id": "NTnB1vHHqbWjBjk4IGXU",
    "type": "sight",
    "location": "Пустошь ветров",
    "time": "2026-01-15T22:58:00"
  },
  {
    "id": "pmsY4kRryeGgDqX9nKW9",
    "time": "2026-01-15T14:58:52",
    "location": "Северный кабук",
    "respawn": {
      "isUnknown": false,
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "time": "22:51:52",
      "date": "2026-01-15"
    },
    "type": "death"
  },
  {
    "id": "BTyikcTI6WN7uocTkEcP",
    "time": "2026-01-15T12:30:00",
    "maintStart": "2026-01-15T08:00:00",
    "type": "maintenance",
    "location": "Сервер",
    "maintEnd": "2026-01-15T12:30:00"
  },
  {
    "id": "OyzGscaVQ6VWG0pzJHmS",
    "location": "Морозная длань",
    "type": "death",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Северный кабук",
      "date": "2026-01-15",
      "time": "14:45:00",
      "isUnknown": false
    },
    "time": "2026-01-15T06:35:50"
  },
  {
    "id": "ciT2wjMlZ5BdSthJJmgc",
    "time": "2026-01-14T20:12:00",
    "type": "sight",
    "location": "Пустошь ветров"
  },
  {
    "id": "TkC2eF5Fjb2wsQtADxLy",
    "respawn": {
      "date": "2026-01-14",
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "isUnknown": false,
      "time": "21:35:00"
    },
    "type": "death",
    "location": "Северный кабук",
    "time": "2026-01-14T13:53:00"
  },
  {
    "id": "L7rTEimFXaAoY6ROcFM7",
    "time": "2026-01-14T06:22:46",
    "location": "Хабул",
    "respawn": {
      "time": "13:40:00",
      "date": "2026-01-14",
      "isUnknown": false,
      "isTimeApproximate": true,
      "location": "Северный кабук"
    },
    "type": "death"
  },
  {
    "id": "xpm7usviQrZCAHUOdk3x",
    "respawn": {
      "isUnknown": false,
      "date": "2026-01-12",
      "isTimeApproximate": true,
      "time": "11:22:00",
      "location": "Хабул"
    },
    "location": "Морозная длань",
    "type": "death",
    "time": "2026-01-12T04:04:30"
  },
  {
    "id": "0gX1UlPkvJz2Btu3yZDv",
    "time": "2026-01-07T15:42:33",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "date": "2026-01-07",
      "isUnknown": false,
      "time": "23:11:00"
    },
    "location": "Хабул",
    "type": "death"
  },
  {
    "id": "o45rIzawL0LGlkKXjtRb",
    "type": "death",
    "respawn": {
      "isUnknown": false,
      "date": "2026-01-07",
      "time": "15:20:00",
      "isTimeApproximate": true,
      "location": "Хабул"
    },
    "time": "2026-01-07T08:13:41",
    "location": "Северный кабук"
  },
  {
    "id": "Sy2nhMkuq0PQU9izMChw",
    "type": "death",
    "time": "2026-01-06T17:24:36",
    "respawn": {
      "time": "00:54:00",
      "location": "Хабул",
      "date": "2026-01-07",
      "isTimeApproximate": false,
      "isUnknown": false
    },
    "location": "Морозная длань"
  },
  {
    "id": "5KbYRrmWQxlXeLC6zHmp",
    "time": "2026-01-06T17:12:00",
    "location": "Морозная длань",
    "type": "sight"
  },
  {
    "id": "0wmOEyCufrKdMyXTDT62",
    "type": "death",
    "time": "2026-01-06T02:38:06",
    "location": "Северный кабук",
    "respawn": {
      "location": "Морозная длань",
      "isUnknown": false,
      "time": "17:12:00",
      "date": "2026-01-06",
      "isTimeApproximate": true
    }
  },
  {
    "id": "Shwk1OlYPtiw4oVeLOSv",
    "type": "death",
    "location": "Морозная длань",
    "time": "2026-01-05T19:12:23",
    "respawn": {
      "location": "Северный кабук",
      "date": "2026-01-06",
      "isUnknown": false,
      "time": "02:18:00",
      "isTimeApproximate": true
    }
  },
  {
    "id": "lAMxaW50fGPSKngCGhpG",
    "location": "Пустошь ветров",
    "time": "2026-01-05T10:44:23",
    "respawn": {
      "isUnknown": false,
      "time": "18:50:00",
      "isTimeApproximate": true,
      "location": "Морозная длань",
      "date": "2026-01-05"
    },
    "type": "death"
  },
  {
    "id": "ApFaP8CjgqsXCNOIvIBP",
    "time": "2026-01-05T10:00:00",
    "type": "maintenance",
    "maintEnd": "2026-01-05T10:00:00",
    "maintStart": "2026-01-05T08:00:00",
    "location": "Сервер"
  },
  {
    "id": "p2sagjYszTKXFCpMyW7a",
    "location": "Северный кабук",
    "respawn": {
      "isTimeApproximate": true,
      "time": "10:20:00",
      "location": "Пустошь ветров",
      "isUnknown": false,
      "date": "2026-01-05"
    },
    "time": "2026-01-05T03:34:00",
    "type": "death"
  },
  {
    "id": "Cic6Z3boDxkJzjqhB2ID",
    "type": "sight",
    "time": "2026-01-04T01:51:00",
    "location": "Алатика"
  },
  {
    "id": "2M6O4TyFb2NAGrLxAtKw",
    "location": "Морозная длань",
    "type": "death",
    "respawn": {
      "time": "01:51:00",
      "date": "2026-01-04",
      "isUnknown": false,
      "isTimeApproximate": false,
      "location": "Алатика"
    },
    "time": "2026-01-03T19:06:43"
  },
  {
    "id": "4cZLamHMI1yzu04sZquS",
    "type": "sight",
    "location": "Морозная длань",
    "time": "2026-01-03T18:36:00"
  },
  {
    "id": "nFvWXZLQv5nlcm4OTEXp",
    "type": "death",
    "respawn": {
      "isTimeApproximate": true,
      "time": "18:36:00",
      "location": "Морозная длань",
      "date": "2026-01-03",
      "isUnknown": false
    },
    "time": "2026-01-03T02:13:00",
    "location": "Пустошь ветров"
  },
  {
    "id": "Z6hfPXyqUrWpUZmphSe8",
    "time": "2026-01-03T01:53:00",
    "location": "Пустошь ветров",
    "type": "sight"
  },
  {
    "id": "MiIzPBSIBwINpDoe3GF2",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "date": "2026-01-03",
      "isUnknown": false,
      "time": "01:53:00"
    },
    "type": "death",
    "time": "2026-01-02T19:22:37",
    "location": "Алатика"
  },
  {
    "id": "AgwDpWGxoMtD9vDXhMr7",
    "respawn": {
      "time": "18:30:00",
      "isUnknown": false,
      "location": "Алатика",
      "date": "2026-01-02",
      "isTimeApproximate": true
    },
    "type": "death",
    "location": "Хабул",
    "time": "2026-01-02T11:21:38"
  },
  {
    "id": "CWkA13VND32limKoj44O",
    "location": "Морозная длань",
    "type": "death",
    "respawn": {
      "time": "11:00:56",
      "isUnknown": false,
      "location": "Хабул",
      "date": "2026-01-02",
      "isTimeApproximate": true
    },
    "time": "2026-01-02T03:34:56"
  },
  {
    "id": "sw2UUeCQB4WpGdySWc1d",
    "location": "Морозная длань",
    "time": "2026-01-02T03:01:00",
    "type": "sight"
  },
  {
    "id": "AJoNjDLC7MVWgLq8JPhq",
    "time": "2025-12-30T19:42:00",
    "type": "sight",
    "location": "Пустошь ветров"
  },
  {
    "id": "85COBMv210H4bHl1K2MP",
    "type": "death",
    "location": "Северный кабук",
    "respawn": {
      "isUnknown": false,
      "location": "Пустошь ветров",
      "time": "19:42:00",
      "date": "2025-12-30",
      "isTimeApproximate": true
    },
    "time": "2025-12-30T06:11:44"
  },
  {
    "id": "xsV92UcQ6VDQtVst1blt",
    "maintStart": "2025-12-29T11:55:00",
    "location": "Сервер",
    "time": "2025-12-29T12:45:00",
    "maintEnd": "2025-12-29T12:45:00",
    "type": "maintenance"
  },
  {
    "id": "GmrgOiYlt9mNVpoX7Wte",
    "time": "2025-12-29T11:30:00",
    "location": "Сервер",
    "maintEnd": "2025-12-29T11:30:00",
    "type": "maintenance",
    "maintStart": "2025-12-29T08:00:00"
  },
  {
    "id": "GdNTnFArguGYZ9UKQ0tU",
    "location": "Морозная длань",
    "time": "2025-12-27T23:18:00",
    "type": "sight"
  },
  {
    "id": "5E9qVHCglzAJ6rq4f2DA",
    "time": "2025-12-24T15:03:22",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Алатика",
      "isUnknown": false,
      "date": "2025-12-24",
      "time": "20:55:00"
    },
    "type": "death",
    "location": "Северный кабук"
  },
  {
    "id": "4c9avL0upPIIBJ8xdf5r",
    "type": "maintenance",
    "location": "Сервер",
    "time": "2025-12-24T11:05:00",
    "maintStart": "2025-12-24T11:00:00",
    "maintEnd": "2025-12-24T11:05:00"
  },
  {
    "id": "Wa29yv9GLchpMgAwlslb",
    "location": "Пустошь ветров",
    "respawn": {
      "time": "22:00:00",
      "isTimeApproximate": true,
      "isUnknown": false,
      "location": "Алатика",
      "date": "2025-12-19"
    },
    "time": "2025-12-19T14:10:11",
    "type": "death"
  },
  {
    "id": "IJvT8Tg7JSkdmKhG2nKe",
    "time": "2025-12-18T15:46:45",
    "location": "Хабул",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Пустошь ветров",
      "isUnknown": false,
      "time": "22:30:45",
      "date": "2025-12-18"
    },
    "type": "death"
  },
  {
    "id": "IQQPPpUsq5BaEztDjOWz",
    "location": "Хабул",
    "time": "2025-12-15T10:05:52",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Алатика",
      "isUnknown": false,
      "date": "2025-12-15",
      "time": "16:40:52"
    },
    "type": "death"
  },
  {
    "id": "PG07IhrrltmSK2FnHVnK",
    "maintEnd": "2025-12-12T12:00:00",
    "type": "maintenance",
    "maintStart": "2025-12-12T10:00:00",
    "location": "Сервер",
    "time": "2025-12-12T12:00:00"
  },
  {
    "id": "LCDOAr7SO0jdAwapkKvL",
    "maintEnd": "2025-12-11T12:15:00",
    "time": "2025-12-11T12:15:00",
    "maintStart": "2025-12-11T08:00:00",
    "location": "Сервер",
    "type": "maintenance"
  },
  {
    "id": "ugNixWjxyjreakJ9ejL9",
    "type": "maintenance",
    "time": "2025-12-10T21:10:00",
    "maintStart": "2025-12-10T20:43:00",
    "maintEnd": "2025-12-10T21:10:00",
    "location": "Сервер"
  },
  {
    "id": "d0ujnpsTGPE7anGAFEBf",
    "maintEnd": "2025-12-09T20:17:00",
    "location": "Сервер",
    "type": "maintenance",
    "maintStart": "2025-12-09T20:00:00",
    "time": "2025-12-09T20:17:00"
  },
  {
    "id": "RnDI58ygWoVWaC96KtBE",
    "location": "Сервер",
    "type": "maintenance",
    "maintStart": "2025-12-09T18:17:00",
    "time": "2025-12-09T18:53:00",
    "maintEnd": "2025-12-09T18:53:00"
  },
  {
    "id": "KdcKarb4GJLo6KexicGC",
    "type": "maintenance",
    "maintStart": "2025-12-09T08:00:00",
    "time": "2025-12-09T15:00:00",
    "maintEnd": "2025-12-09T15:00:00",
    "location": "Сервер"
  },
  {
    "id": "dJFK9G8UVB2tLl6dsDRb",
    "respawn": {
      "time": "19:45:52",
      "date": "2025-12-07",
      "location": "Пустошь ветров",
      "isUnknown": false,
      "isTimeApproximate": false
    },
    "location": "Северный кабук",
    "time": "2025-12-07T13:40:52",
    "type": "death"
  },
  {
    "id": "YcGARUVV4ssdkJ3fWmh6",
    "location": "Хабул",
    "time": "2025-12-05T13:56:54",
    "respawn": {
      "isTimeApproximate": true,
      "location": "Северный кабук",
      "isUnknown": false,
      "time": "21:39:00",
      "date": "2025-12-05"
    },
    "type": "death"
  },
  {
    "id": "PtWCtut8O6HqU5fclcgV",
    "time": "2025-12-02T11:30:00",
    "maintStart": "2025-12-02T08:00:00",
    "type": "maintenance",
    "maintEnd": "2025-12-02T11:30:00",
    "location": "Сервер"
  },
  {
    "id": "cnIKSCHmzh9CLu8XyL1T",
    "type": "sight",
    "location": "Пустошь ветров",
    "time": "2025-11-27T01:40:00"
  },
  {
    "id": "yXs7hU1Zyerzkc6qmpYi",
    "type": "sight",
    "location": "Пустошь ветров",
    "time": "2025-11-22T23:47:00"
  }
];
