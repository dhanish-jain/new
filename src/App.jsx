import { useEffect, useMemo, useState } from "react";

function App() {
  const [funds, setFunds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFund, setSelectedFund] = useState(null);
  const [units, setUnits] = useState("");
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFunds();
  }, []);

  async function loadFunds() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://api.allorigins.win/raw?url=https://portal.amfiindia.com/spages/NAVAll.txt"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NAV data (status ${response.status})`);
      }

      const text = await response.text();
      const lines = text.split("\n");
      const parsed = [];

      lines.forEach((line) => {
        const parts = line.split(";");

        if (parts.length > 4 && parts[3] && parts[4]) {
          const nav = parseFloat(parts[4]);

          if (!Number.isNaN(nav)) {
            parsed.push({
              name: parts[3].trim(),
              nav,
            });
          }
        }
      });

      setFunds(parsed);
    } catch (err) {
      console.error("Error loading funds:", err);
      setError("Unable to load NAV data right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const filteredFunds = useMemo(
    () => funds.filter((fund) => fund.name.toLowerCase().includes(search.toLowerCase())),
    [funds, search]
  );

  function handleSelect(fund) {
    setSelectedFund(fund);
    setUnits("");
    setValue(null);
  }

  function calculate() {
    if (!selectedFund) return;

    const parsedUnits = parseFloat(units);
    if (Number.isNaN(parsedUnits) || parsedUnits <= 0) return;

    setValue((selectedFund.nav * parsedUnits).toFixed(2));
  }

  return (
    <div className="container">
      <h1>AMFI Portfolio Tracker</h1>

      <input
        type="text"
        placeholder="Search fund..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading && <p className="status">Loading latest NAV data...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="fund-list">
          {filteredFunds.slice(0, 50).map((fund) => (
            <div key={`${fund.name}-${fund.nav}`} className="fund-item" onClick={() => handleSelect(fund)}>
              {fund.name} (₹{fund.nav})
            </div>
          ))}
        </div>
      )}

      {selectedFund && (
        <div className="selected">
          <p>
            Selected: <b>{selectedFund.name}</b>
          </p>

          <input
            type="number"
            min="0"
            step="any"
            placeholder="Enter units"
            value={units}
            onChange={(event) => setUnits(event.target.value)}
          />

          <button type="button" onClick={calculate}>
            Calculate
          </button>
        </div>
      )}

      {value && <div className="result">Portfolio Value: ₹{value}</div>}
    </div>
  );
}

export default App;
