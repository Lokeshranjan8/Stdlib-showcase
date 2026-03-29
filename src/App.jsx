import { useState, useEffect } from "react";
import { BellCurve, CDFBars } from "./chats.jsx";
import { ZTest } from "./zst.jsx";
import { Ttest } from "./ttest.jsx";
import { PcorrTest } from "./pcorrtst.jsx";
import { mean, stdev, normalCDF } from "../analysis/Stats.js";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0]
    .split(",")
    .map(h => h.trim().toLowerCase().replace(/"/g, ""));

  return lines
    .slice(1)
    .map(line => {
      const vals = line.split(",");
      const row = {};
      headers.forEach((h, i) => {
        row[h] = parseFloat(vals[i]);
      });
      return row;
    })
    .filter(r => !isNaN(r.age));
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/heart.csv")
      .then(r => {
        if (!r.ok) throw new Error("CSV not found");
        return r.text();
      })
      .then(parseCSV)
      .then(setData)
      .catch(e => setError(e.message));
  }, []);



  const ages = data ? data.map(r => r.age).filter(v => !isNaN(v)) : [];
  const chols = data ? data.map(r => r.chol).filter(v => !isNaN(v)) : [];
  const ageMu = ages.length ? mean(ages) : 54.4;
  const ageSig = ages.length > 1 ? stdev(ages) : 9.1;
  const cholMu = chols.length ? mean(chols) : 246.3;
  const cholSig = chols.length > 1 ? stdev(chols) : 51.8;



  const p55 = ages.length ? ((1 - normalCDF(55, ageMu, ageSig)) * 100).toFixed(1): "0.0";
  const p240 = chols.length ? ((1 - normalCDF(240, cholMu, cholSig)) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-white text-black p-6 font-mono space-y-6">
      {error && (
        <div className="text-sm text-red-700 border border-red-300 px-3 py-2 rounded">
          Error: {error}
        </div>
      )}


      {data && (
        <div className="border rounded p-4 space-y-3">
          <div className="text-sm font-semibold tracking-wide">
            Overview
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500">Samples</div>
              <div className="text-lg font-semibold">{data.length}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Mean Age</div>
              <div className="text-lg font-semibold">{ageMu.toFixed(1)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Mean Cholesterol</div>
              <div className="text-lg font-semibold">{cholMu.toFixed(1)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Age &gt; 55</div>
              <div className="text-lg font-semibold">{p55}%</div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="border rounded p-4 space-y-2">
            <div className="text-sm font-semibold">Age Distribution</div>

            <BellCurve mu={ageMu} sigma={ageSig} />

            <div className="text-xs text-gray-600">
              Mean: {ageMu.toFixed(1)} &nbsp; | &nbsp; Std Dev: {ageSig.toFixed(1)}
            </div>
          </div>

          <div className="border rounded p-4 space-y-2">
            <div className="text-sm font-semibold">Cholesterol Distribution</div>

            <CDFBars mu={cholMu} sigma={cholSig} />

            <div className="text-xs text-gray-600 space-y-1">
              <div>
                P(chol &lt; 200): {(normalCDF(200, cholMu, cholSig) * 100).toFixed(1)}%
              </div>
              <div>
                P(chol &gt; 240): {p240}%
              </div>
            </div>
          </div>

        </div>
      )}

{data && <ZTest data={data} />}
      {data && <Ttest data={data} />}
      {data && <PcorrTest data={data} />}

    </div>
  );
}
