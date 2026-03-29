import { pcorrtestfn } from "../analysis/Stats.js";

export function PcorrTest({ data }) {
  const age_arr = data.map(r => r.age).filter(v => !isNaN(v));
  const chol_arr = data.map(r => r.chol).filter(v => !isNaN(v));
  const n = Math.min(age_arr.length, chol_arr.length);
  const result = n > 1 ? pcorrtestfn(age_arr, chol_arr) : {pcorr: 0, statistic: 0, pValue: 1, rejected: false, ci: [0,0]};
  const rejected = result.pValue < 0.05;
  const corrDir = result.pcorr > 0 ? 'positive' : 'negative';

  return (
    <div className="p-3 border border-gray-400 rounded">
      <div className="text-lg font-bold mb-2">Pearson Corr: Age vs Chol</div>
      <div className="text-sm text-gray-800 mb-3 space-y-1">
        <div>H0: correlation coeff = 0</div>
        <div>H1: correlation coeff ≠ 0 (two-sided)</div>
      </div>


      <div className="grid grid-cols-2 gap-1 text-xs mb-3">
        {[
          ["number of patients", n],
          ["correlation", result.pcorr.toFixed(4)],
          ["t-stat", result.statistic.toFixed(3)],
          ["p-value", result.pValue < 0.000001 ? "<0.000001" : result.pValue.toFixed(5)],
          ["95% CI low[0]", result.ci[0].toFixed(4)],
          ["95% CI high[1]", result.ci[1].toFixed(4)],
        ].map(([label, val]) => (
          <div key={label} className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="text-gray-600 text-xs uppercase tracking-wide">{label}</div>
            <div className="text-sm font-mono font-bold text-gray-900">{val}</div>
          </div>
        ))}
      </div>


      <div className={`text-sm p-2 rounded font-medium ${rejected ? "bg-blue-20 border border-blue-200 text-blue-800" : "bg-gray-50 border border-gray-200 text-gray-800"}`}>
        {rejected ? `REJECT H0 (p=${result.pValue.toFixed(6)} < 0.05)` : `FAIL TO REJECT H0`}  <br />
        {rejected ? `Significant ${corrDir} correlation (${result.pcorr.toFixed(4)}): age & ${corrDir === 'positive' ? 'higher' : 'lower'} chol` : "No significant linear relationship"}
      </div>
    </div>
  );
}

