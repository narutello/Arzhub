# ارزهاب

قیمت لحظه‌ای ارز در بازار آزاد تهران — به تومان.

**دمو:** [arzhub.vercel.app](https://arzhub.vercel.app)

---

## ویژگی‌ها

- قیمت لحظه‌ای ده‌ها ارز (دلار، یورو، پوند، درهم، لیر، تتر و ...)
- نمودار تاریخی واقعی با بازه‌های ۱ روز تا ۱ سال
- تبدیل ارز به تومان و برعکس
- فهرست پیگیری (Watchlist)
- پشتیبانی از حالت روشن و تاریک
- طراحی واکنش‌گرا (موبایل و دسکتاپ)
- قابل نصب به‌صورت PWA

## منبع داده

| اولویت | منبع | کاربرد |
|--------|------|--------|
| ۱ | [TGJU](https://www.tgju.org/) | قیمت لحظه‌ای + نمودار تاریخی |
| ۲ | [Bonbast](https://www.bonbast.com/) | جایگزین در صورت قطعی TGJU |

قیمت‌ها از **ریال** به **تومان** تبدیل می‌شوند.

## تکنولوژی‌ها

- **Framework:** TanStack Start (React + Vite)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data:** Server Functions + React Query
- **Deploy:** Vercel

## اجرا روی سیستم خودت

```bash
# کلون کردن
git clone https://github.com/narutello/Arzhub.git
cd Arzhub

# نصب وابستگی‌ها
npm install

# اجرای حالت توسعه
npm run dev
```

سایت روی `http://localhost:8080` بالا می‌آید.

### اسکریپت‌های مفید

| دستور | توضیح |
|-------|--------|
| `npm run dev` | اجرای محیط توسعه |
| `npm run build` | ساخت نسخه پروداکشن |
| `npm run typecheck` | بررسی تایپ‌اسکریپت |
| `npm run lint` | بررسی eslint |
| `npm test` | اجرای تست‌ها |

## ساختار پروژه

```
src/
├── components/     # کامپوننت‌های UI (نمودار، تبدیل‌گر، لیست ارز و ...)
├── lib/
│   ├── market.ts   # دریافت قیمت از TGJU / Bonbast
│   ├── currencies.ts
│   └── types.ts
└── routes/         # صفحات (خانه، ارزها، تبدیل، واچ‌لیست)
```

## لایسنس

این پروژه برای استفاده شخصی و آموزشی آزاد است.
