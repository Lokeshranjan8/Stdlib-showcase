Analyzed Heart Disease dataset using stdlib math functions. I used the normal probability density function(`normalPDF`) to visualize age distribution, `normalCDF` to measure cholesterol risk across clinical thresholds, and `z-test` to validate whether the dataset mean cholesterol is significantly higher than the healthy standard of 200 mg/dl.

## Age Distribution

<p align="center">
  <img width="700" alt="Age distribution plot" src="https://github.com/user-attachments/assets/a3502383-3aa4-443b-ad5f-5db102abe616" />
</p>

I used `normalPDF` to visualize how patient ages are distributed.  
The average age is around **54 years**, meaning roughly half of the patients fall above this value, including those over 55, which is generally considered a higher-risk group for heart disease.

---

## Cholesterol Distribution

<p align="center">
  <img width="700" alt="Cholesterol distribution plot" src="https://github.com/user-attachments/assets/f9866ab4-4cd1-47de-bc09-2092d55e442c" />
</p>

I used `normalCDF` to estimate what percentage of patients fall below standard clinical thresholds.  
The mean cholesterol level is **246 mg/dl**, which is already above the **240 borderline limit**.  
Only about **18% of patients** have healthy cholesterol levels (below 200 mg/dl).

---

## Hypothesis Testing

<p align="center">
  <img width="700" alt="Hypothesis test output" src="https://github.com/user-attachments/assets/5d9f6a07-1312-4baf-8d5b-a3129d221e50" />
</p>

I used a `z-test` to check whether the dataset's mean cholesterol is significantly higher than the healthy standard of **200 mg/dl**.  
The test rejected the null hypothesis with a very low p-value, indicating that the difference is statistically significant and not due to chance.


## Dataset

Heart Disease dataset (`heart.csv`) with 303 patients and 14 columns.

Columns used in this analysis:

| Column | Description |
|---|---|
|`age`|Patient age (years)|
|`chol`|Cholesterol level (mg/dl)|
|`trestbps`|Resting blood pressure|
|`thalach`|Max heart rate achieved|
|`oldpeak`|ST depression from exercise|
|`fbs`|Fasting blood sugar > 120 mg/dl (1 = true)|
|`target`|Heart disease present (1 = yes)|

---

## How to Setup Locally

```bash
git clone https://github.com/username/Stdlib-showcase.git
cd Stdlib-showcase
npm install
```

---

## Running the Scripts in Terminal

```bash
# normal PDF —
node analysis/normal_pdf.js

# normal CDF —
node analysis/normal_cdf.js

# z-test —
node analysis/ztest.js
```

---

## Running the Frontend

```bash
npm run dev
```

Opens at `http://localhost:5173`.

---
