import { useState, useEffect } from "react";
import { 
  FaThermometerHalf, FaWind, FaTint, FaLightbulb,
  FaSave, FaUndo, FaRobot, FaChartLine, FaCog,
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaArrowRight, FaToggleOn, FaToggleOff, FaSlidersH,
  FaBrain, FaBalanceScale, FaClock, FaUsers
} from "react-icons/fa";
import { MdCo2, MdSensors } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import "./FM_ComfortRules.css";

// Mock current sensor data for examples
const currentSensorData = {
  "RM002": {
    temperature: 23.1,
    co2: 620,
    humidity: 42,
    light: 250
  }
};

// Mock AI suggestions
const aiSuggestions = [
  {
    id: 1,
    parameter: "CO2 Threshold",
    currentValue: "1000 ppm",
    suggestedValue: "800 ppm",
    confidence: 85,
    impact: "Improve air quality in 5 rooms",
    reason: "Current threshold allows poor air quality during peak occupancy"
  },
  {
    id: 2,
    parameter: "Lighting Minimum",
    currentValue: "200 lux",
    suggestedValue: "350 lux",
    confidence: 72,
    impact: "Increase comfort in meeting rooms",
    reason: "70% of meetings have light levels below optimal"
  },
  {
    id: 3,
    parameter: "Temperature Range",
    currentValue: "19-26°C",
    suggestedValue: "21-24°C",
    confidence: 91,
    impact: "Reduce complaints by 45%",
    reason: "Most comfort complaints occur outside this range"
  }
];

// Default comfort model
const defaultModel = {
  temperature: {
    min: 21,
    max: 24,
    ideal: 22.5,
    weight: 30
  },
  co2: {
    optimal: 450,
    warning: 800,
    critical: 1000,
    weight: 30
  },
  humidity: {
    min: 40,
    max: 60,
    ideal: 50,
    weight: 20
  },
  lighting: {
    min: 300,
    ideal: 400,
    weight: 20
  },
  presenceLogic: {
    enabled: true,
    relaxLighting: true,
    expandTemperatureRange: true,
    unoccupiedTempMin: 18,
    unoccupiedTempMax: 27,
    unoccupiedLightMin: 100
  },
  advanced: {
    sensorSmoothingInterval: 5,
    dataAveragingWindow: 15,
    weightNormalization: true,
    aiAggressiveness: 50,
    comfortStabilityThreshold: 0.3,
    energyVsComfortBalance: 50
  }
};

// Load rules from localStorage or use initial data
const loadRules = () => {
  const savedRules = localStorage.getItem('comfort_model');
  if (savedRules) {
    try {
      return JSON.parse(savedRules);
    } catch (error) {
      return defaultModel;
    }
  }
  return defaultModel;
};

export default function FM_ComfortRules() {
  const [model, setModel] = useState(loadRules);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiOptimization, setAiOptimization] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [impactPreview, setImpactPreview] = useState({
    compliant: 12,
    moderate: 3,
    critical: 2,
    avgScore: 8.2,
    newAvgScore: 8.7
  });

  // Save to localStorage when model changes
  useEffect(() => {
    localStorage.setItem('comfort_model', JSON.stringify(model));
  }, [model]);

  // Calculate example score based on current model
  const calculateExampleScore = () => {
    const data = currentSensorData["RM002"];
    
    const tempScore = Math.min(10, Math.max(0, 
      10 * (1 - Math.abs(data.temperature - model.temperature.ideal) / 5)
    ));
    
    const co2Score = data.co2 <= model.co2.optimal ? 10 :
                     data.co2 <= model.co2.warning ? 7 :
                     data.co2 <= model.co2.critical ? 4 : 1;
    
    const humidityScore = data.humidity >= model.humidity.min && data.humidity <= model.humidity.max
      ? 10 - Math.abs(data.humidity - model.humidity.ideal) * 0.5
      : 4;
    
    const lightScore = data.light >= model.lighting.min
      ? Math.min(10, data.light / model.lighting.ideal * 10)
      : 3;
    
    const finalScore = (
      (tempScore * (model.temperature.weight / 100)) +
      (co2Score * (model.co2.weight / 100)) +
      (humidityScore * (model.humidity.weight / 100)) +
      (lightScore * (model.lighting.weight / 100))
    ).toFixed(1);

    return {
      temp: tempScore.toFixed(1),
      co2: co2Score.toFixed(1),
      humidity: humidityScore.toFixed(1),
      light: lightScore.toFixed(1),
      final: finalScore
    };
  };

  const exampleScore = calculateExampleScore();

  const handleChange = (section, field, value) => {
    setModel(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleWeightChange = (section, value) => {
    const newWeight = parseInt(value);
    const currentWeights = {
      temperature: model.temperature.weight,
      co2: model.co2.weight,
      humidity: model.humidity.weight,
      lighting: model.lighting.weight
    };
    
    const totalOther = Object.values(currentWeights).reduce((a, b) => a + b, 0) - currentWeights[section];
    const maxAllowed = 100 - totalOther;
    
    if (newWeight > maxAllowed) {
      alert(`Maximum weight for ${section} is ${maxAllowed}%`);
      return;
    }

    setModel(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        weight: newWeight
      }
    }));
    setHasChanges(true);
  };

  const handleReset = () => {
    if (window.confirm("Reset all comfort rules to default values?")) {
      setModel(defaultModel);
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    setHasChanges(false);
    alert("Comfort model updated successfully");
  };

  const handleAcceptSuggestion = (suggestion) => {
    console.log("Accepting suggestion:", suggestion);
    setSelectedSuggestion(null);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "score-green";
    if (score >= 6) return "score-amber";
    return "score-red";
  };

  return (
    <div className="comfort-rules-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Comfort Model & Default Room Rules</h1>
          <p className="page-subtitle">
            Define environmental baselines used by the AI Comfort Engine
          </p>
        </div>
        <div className="header-actions">
          <div className="ai-toggle">
            <span>AI Optimization</span>
            <button 
              onClick={() => setAiOptimization(!aiOptimization)}
              className={`toggle-btn ${aiOptimization ? 'active' : ''}`}
            >
              {aiOptimization ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
          <button onClick={handleReset} className="reset-btn">
            <FaUndo /> Reset
          </button>
          <button 
            onClick={handleSave}
            className={`save-btn ${hasChanges ? 'active' : 'disabled'}`}
            disabled={!hasChanges}
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Global Comfort Baseline Panel */}
        <div className="panel">
          <div className="panel-header">
            <h2><FaSlidersH className="panel-icon blue" /> Global Comfort Baseline</h2>
          </div>
          
          <div className="panel-body">
            <div className="parameters-grid">
              {/* Temperature */}
              <div className="parameter-card">
                <div className="parameter-header">
                  <h3><FaThermometerHalf className="temp-icon" /> Temperature</h3>
                  <div className="weight-control">
                    <span>Weight</span>
                    <input 
                      type="number" 
                      value={model.temperature.weight}
                      onChange={(e) => handleWeightChange('temperature', e.target.value)}
                      className="weight-input"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div className="parameter-inputs">
                  <div className="input-group">
                    <label>Min (°C)</label>
                    <input 
                      type="number" 
                      value={model.temperature.min}
                      onChange={(e) => handleChange('temperature', 'min', parseFloat(e.target.value))}
                      step="0.5"
                    />
                  </div>
                  <div className="input-group">
                    <label>Ideal (°C)</label>
                    <input 
                      type="number" 
                      value={model.temperature.ideal}
                      onChange={(e) => handleChange('temperature', 'ideal', parseFloat(e.target.value))}
                      step="0.5"
                    />
                  </div>
                  <div className="input-group">
                    <label>Max (°C)</label>
                    <input 
                      type="number" 
                      value={model.temperature.max}
                      onChange={(e) => handleChange('temperature', 'max', parseFloat(e.target.value))}
                      step="0.5"
                    />
                  </div>
                </div>
              </div>

              {/* CO2 */}
              <div className="parameter-card">
                <div className="parameter-header">
                  <h3><MdCo2 className="co2-icon" /> CO₂</h3>
                  <div className="weight-control">
                    <span>Weight</span>
                    <input 
                      type="number" 
                      value={model.co2.weight}
                      onChange={(e) => handleWeightChange('co2', e.target.value)}
                      className="weight-input"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div className="parameter-inputs">
                  <div className="input-group">
                    <label>Optimal (ppm)</label>
                    <input 
                      type="number" 
                      value={model.co2.optimal}
                      onChange={(e) => handleChange('co2', 'optimal', parseInt(e.target.value))}
                      step="50"
                    />
                  </div>
                  <div className="input-group">
                    <label>Warning (ppm)</label>
                    <input 
                      type="number" 
                      value={model.co2.warning}
                      onChange={(e) => handleChange('co2', 'warning', parseInt(e.target.value))}
                      step="50"
                    />
                  </div>
                  <div className="input-group">
                    <label>Critical (ppm)</label>
                    <input 
                      type="number" 
                      value={model.co2.critical}
                      onChange={(e) => handleChange('co2', 'critical', parseInt(e.target.value))}
                      step="50"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="parameter-card">
                <div className="parameter-header">
                  <h3><FaTint className="humidity-icon" /> Humidity</h3>
                  <div className="weight-control">
                    <span>Weight</span>
                    <input 
                      type="number" 
                      value={model.humidity.weight}
                      onChange={(e) => handleWeightChange('humidity', e.target.value)}
                      className="weight-input"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div className="parameter-inputs">
                  <div className="input-group">
                    <label>Min (%)</label>
                    <input 
                      type="number" 
                      value={model.humidity.min}
                      onChange={(e) => handleChange('humidity', 'min', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Ideal (%)</label>
                    <input 
                      type="number" 
                      value={model.humidity.ideal}
                      onChange={(e) => handleChange('humidity', 'ideal', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Max (%)</label>
                    <input 
                      type="number" 
                      value={model.humidity.max}
                      onChange={(e) => handleChange('humidity', 'max', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Lighting */}
              <div className="parameter-card">
                <div className="parameter-header">
                  <h3><FaLightbulb className="light-icon" /> Lighting</h3>
                  <div className="weight-control">
                    <span>Weight</span>
                    <input 
                      type="number" 
                      value={model.lighting.weight}
                      onChange={(e) => handleWeightChange('lighting', e.target.value)}
                      className="weight-input"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div className="parameter-inputs two-cols">
                  <div className="input-group">
                    <label>Min (lux)</label>
                    <input 
                      type="number" 
                      value={model.lighting.min}
                      onChange={(e) => handleChange('lighting', 'min', parseInt(e.target.value))}
                      step="50"
                    />
                  </div>
                  <div className="input-group">
                    <label>Ideal (lux)</label>
                    <input 
                      type="number" 
                      value={model.lighting.ideal}
                      onChange={(e) => handleChange('lighting', 'ideal', parseInt(e.target.value))}
                      step="50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Presence Logic */}
            <div className="presence-logic">
              <div className="presence-header">
                <h3><FaUsers className="users-icon" /> Presence Logic</h3>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={model.presenceLogic.enabled}
                    onChange={(e) => handleChange('presenceLogic', 'enabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {model.presenceLogic.enabled && (
                <div className="presence-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={model.presenceLogic.relaxLighting}
                      onChange={(e) => handleChange('presenceLogic', 'relaxLighting', e.target.checked)}
                    />
                    Reduce lighting when unoccupied
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={model.presenceLogic.expandTemperatureRange}
                      onChange={(e) => handleChange('presenceLogic', 'expandTemperatureRange', e.target.checked)}
                    />
                    Expand temperature range when unoccupied
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comfort Score Model Panel */}
        <div className="panel">
          <div className="panel-header">
            <h2><FaChartLine className="panel-icon green" /> Comfort Score Model</h2>
          </div>
          
          <div className="panel-body">
            <div className="score-grid">
              {/* Score Formula */}
              <div className="formula-section">
                <h3>Score Calculation Formula</h3>
                <div className="formula-box">
                  <p>Comfort Score =</p>
                  <p className="formula-line">(Temp Score × {model.temperature.weight}%) +</p>
                  <p className="formula-line">(CO₂ Score × {model.co2.weight}%) +</p>
                  <p className="formula-line">(Humidity Score × {model.humidity.weight}%) +</p>
                  <p className="formula-line">(Light Score × {model.lighting.weight}%)</p>
                </div>
                
                <div className="weight-info">
                  <FaInfoCircle /> Total weight: {model.temperature.weight + model.co2.weight + model.humidity.weight + model.lighting.weight}%
                  {model.temperature.weight + model.co2.weight + model.humidity.weight + model.lighting.weight !== 100 && 
                    <span className="warning-text"> (should sum to 100%)</span>
                  }
                </div>
              </div>

              {/* Real-Time Example */}
              <div className="example-section">
                <h3>Live Example (Meeting Room 2)</h3>
                <div className="example-box">
                  <div className="score-row">
                    <span>Temperature: 23.1°C</span>
                    <span className={getScoreColor(exampleScore.temp)}>{exampleScore.temp}/10</span>
                  </div>
                  <div className="score-row">
                    <span>CO₂: 620 ppm</span>
                    <span className={getScoreColor(exampleScore.co2)}>{exampleScore.co2}/10</span>
                  </div>
                  <div className="score-row">
                    <span>Humidity: 42%</span>
                    <span className={getScoreColor(exampleScore.humidity)}>{exampleScore.humidity}/10</span>
                  </div>
                  <div className="score-row">
                    <span>Light: 250 lux</span>
                    <span className={getScoreColor(exampleScore.light)}>{exampleScore.light}/10</span>
                  </div>
                  <div className="score-total">
                    <span>Final Score:</span>
                    <span className={getScoreColor(exampleScore.final)}>{exampleScore.final} / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <div className="panel">
          <div className="panel-header">
            <h2><FaRobot className="panel-icon purple" /> AI Optimization Suggestions</h2>
          </div>
          
          <div className="panel-body">
            <div className="suggestions-list">
              {aiSuggestions.map(suggestion => (
                <div 
                  key={suggestion.id} 
                  className={`suggestion-card ${selectedSuggestion === suggestion.id ? 'selected' : ''}`}
                >
                  <div className="suggestion-header">
                    <div>
                      <h4>{suggestion.parameter}</h4>
                      <p className="suggestion-reason">{suggestion.reason}</p>
                    </div>
                    <span className="confidence-badge">
                      {suggestion.confidence}% confidence
                    </span>
                  </div>
                  
                  <div className="suggestion-values">
                    <div className="current-value">
                      <span className="value-label">Current:</span>
                      <span>{suggestion.currentValue}</span>
                    </div>
                    <div className="suggested-value">
                      <span className="value-label">Suggested:</span>
                      <span>{suggestion.suggestedValue}</span>
                    </div>
                  </div>
                  
                  <div className="suggestion-footer">
                    <div className="impact-info">
                      <FaInfoCircle /> {suggestion.impact}
                    </div>
                    <div className="suggestion-actions">
                      <button 
                        onClick={() => handleAcceptSuggestion(suggestion)}
                        className="accept-btn"
                      >
                        Accept
                      </button>
                      <button className="ignore-btn">Ignore</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Preview Panel */}
        <div className="panel">
          <div className="panel-header">
            <h2><FaBrain className="panel-icon indigo" /> Impact Preview</h2>
          </div>
          
          <div className="panel-body">
            <div className="impact-grid">
              <div className="impact-card compliant">
                <div className="impact-number">{impactPreview.compliant}</div>
                <div className="impact-label">Rooms Compliant</div>
              </div>
              <div className="impact-card moderate">
                <div className="impact-number">{impactPreview.moderate}</div>
                <div className="impact-label">Rooms Moderate</div>
              </div>
              <div className="impact-card critical">
                <div className="impact-number">{impactPreview.critical}</div>
                <div className="impact-label">Rooms Critical</div>
              </div>
            </div>
            
            <div className="score-shift">
              <span>Average Comfort Score Shift:</span>
              <span className="shift-value">
                <span>{impactPreview.avgScore}</span>
                <FaArrowRight className="shift-arrow" />
                <span className="new-score">{impactPreview.newAvgScore}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="panel">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
          >
            <h2><FaCog className="panel-icon gray" /> Advanced Settings</h2>
            <span>{showAdvanced ? '▼' : '▶'}</span>
          </button>
          
          {showAdvanced && (
            <div className="panel-body">
              <div className="advanced-grid">
                <div className="advanced-section">
                  <h3>Sensor & Data Processing</h3>
                  <div className="input-group">
                    <label>Sensor Smoothing Interval (minutes)</label>
                    <input 
                      type="number" 
                      value={model.advanced.sensorSmoothingInterval}
                      onChange={(e) => handleChange('advanced', 'sensorSmoothingInterval', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Data Averaging Window (minutes)</label>
                    <input 
                      type="number" 
                      value={model.advanced.dataAveragingWindow}
                      onChange={(e) => handleChange('advanced', 'dataAveragingWindow', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="advanced-section">
                  <h3>AI Behavior</h3>
                  <div className="slider-group">
                    <label>AI Aggressiveness</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={model.advanced.aiAggressiveness}
                      onChange={(e) => handleChange('advanced', 'aiAggressiveness', parseInt(e.target.value))}
                    />
                    <div className="slider-labels">
                      <span>Conservative</span>
                      <span>{model.advanced.aiAggressiveness}%</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                  
                  <div className="slider-group">
                    <label>Energy vs Comfort Balance</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={model.advanced.energyVsComfortBalance}
                      onChange={(e) => handleChange('advanced', 'energyVsComfortBalance', parseInt(e.target.value))}
                    />
                    <div className="slider-labels">
                      <span>Energy Saving</span>
                      <span>{model.advanced.energyVsComfortBalance}%</span>
                      <span>Max Comfort</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}