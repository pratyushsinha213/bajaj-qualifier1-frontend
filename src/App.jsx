import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Set the document title to your roll number
  document.title = "21BCE3531";

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  const validateJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return { valid: true, error: null };
    } catch (err) {
      // Log the error for debugging
      console.error('JSON Parsing Error:', err);
      return { valid: false, error: err.message };
    }
  };
  

  const handleSubmit = async () => {
    if (!validateJson(jsonData)) {
      setError('Invalid JSON format');
      return;
    }
  
    setError('');
    setShowDropdown(false);
    setResponse(null);
  
    try {
      const parsedData = JSON.parse(jsonData);
      const res = await axios.post('http://localhost:3000/bfhl', { data: parsedData.data });
      setResponse(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error('API call failed:', err.response ? err.response.data : err.message);
      setError('Error calling the API');
    }
  };
  

  const handleDropdownChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    let displayData = {};
    if (selectedOptions.includes('Alphabets')) {
      displayData['Alphabets'] = response.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      displayData['Numbers'] = response.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      displayData['Highest lowercase alphabet'] = response.highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response Data:</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' , textAlign: "center"}}>
      <h1>Frontend JSON</h1>
      <div>
        <textarea
          rows="4"
          cols="50"
          placeholder='Enter JSON data'
          value={jsonData}
          onChange={handleJsonChange}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      {showDropdown && (
        <div>
          <h3>Select Data to Display</h3>
          <select multiple onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}
      {renderResponse()}
    </div>
  );
}

export default App;