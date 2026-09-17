import { useState } from "react";

/**
 * InsuranceCostPredictor
 * ------------------------------------------------------------------
 * Form untuk memprediksi biaya asuransi lewat backend FastAPI
 * (endpoint POST /predict).
 *
 * URL API dibaca dari environment variable VITE_INSURANCE_API_URL
 * (lihat .env.example) -- BUKAN di-hardcode di sini, supaya URL
 * bisa beda antara local dev, staging, dan production tanpa ubah kode.
 */

const API_BASE_URL =
  import.meta.env.VITE_INSURANCE_API_URL || "https://backend-medical-cost-prediction.up.railway.app";

const REGIONS = [
  { value: "southwest", label: "Southwest" },
  { value: "southeast", label: "Southeast" },
  { value: "northwest", label: "Northwest" },
  { value: "northeast", label: "Northeast" },
];

const initialForm = {
  age: "",
  sex: "male",
  bmi: "",
  children: "",
  smoker: "no",
  region: "southeast",
};

function validate(form) {
  const errors = {};

  const age = Number(form.age);
  if (!form.age || Number.isNaN(age) || age < 18 || age > 100) {
    errors.age = "Usia harus antara 18 dan 100 tahun.";
  }

  const bmi = Number(form.bmi);
  if (!form.bmi || Number.isNaN(bmi) || bmi <= 10 || bmi >= 60) {
    errors.bmi = "BMI harus antara 10 dan 60.";
  }

  const children = Number(form.children);
  if (form.children === "" || Number.isNaN(children) || children < 0 || children > 10) {
    errors.children = "Jumlah anak harus antara 0 dan 10.";
  }

  return errors;
}

export default function InsuranceCostPredictor() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    setApiError("");
    setResult(null);

    const payload = {
      age: Number(form.age),
      sex: form.sex,
      bmi: Number(form.bmi),
      children: Number(form.children),
      smoker: form.smoker,
      region: form.region,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ? JSON.stringify(body.detail) : `Request gagal (status ${response.status}).`);
      }

      const data = await response.json();
      setResult(data);
      setStatus("success");
    } catch (err) {
      setApiError(
        err instanceof TypeError
          ? "Tidak bisa menghubungi server. Cek koneksi internet atau apakah API sedang aktif."
          : err.message
      );
      setStatus("error");
    }
  }

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Estimasi Biaya Asuransi</h2>
      <p className="mt-1 text-sm text-gray-500">
        Isi profil di bawah untuk memperkirakan biaya asuransi kesehatan tahunan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Usia
          </label>
          <input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            value={form.age}
            onChange={handleChange}
            placeholder="35"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <select
              id="sex"
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div>
            <label htmlFor="smoker" className="block text-sm font-medium text-gray-700">
              Merokok
            </label>
            <select
              id="smoker"
              name="smoker"
              value={form.smoker}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="no">Tidak</option>
              <option value="yes">Ya</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
            BMI (Body Mass Index)
          </label>
          <input
            id="bmi"
            name="bmi"
            type="number"
            step="0.1"
            inputMode="decimal"
            value={form.bmi}
            onChange={handleChange}
            placeholder="27.5"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.bmi && <p className="mt-1 text-xs text-red-600">{errors.bmi}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="children" className="block text-sm font-medium text-gray-700">
              Jumlah Anak
            </label>
            <input
              id="children"
              name="children"
              type="number"
              inputMode="numeric"
              value={form.children}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.children && <p className="mt-1 text-xs text-red-600">{errors.children}</p>}
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Wilayah
            </label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Menghitung..." : "Hitung Estimasi"}
        </button>
      </form>

      {status === "error" && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {status === "success" && result && (
        <div className="mt-4 rounded-md bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-sm text-green-800">Estimasi biaya asuransi tahunan:</p>
          <p className="mt-1 text-2xl font-semibold text-green-900">
            {formatUSD(result.predicted_charges)}
          </p>
        </div>
      )}
    </div>
  );
}
