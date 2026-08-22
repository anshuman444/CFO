# AI CFO Prototype

A clean, modern AI CFO demo interface for startup financial analysis. This prototype uses your existing backend Python logic to calculate runway, risk, profit margin, and generate CFO-style guidance through a local LLM.

## Features

- Minimal startup-style dashboard with Streamlit
- Input fields for key startup financials
- One-click CFO analysis with an AI-generated response
- Metrics summary for runway, risk, status, and profit margin
- Colored risk indicator for fast visual clarity
- Loading spinner while the LLM processes the request

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Start LM Studio / your local LLM endpoint.

- The backend expects the local LLM API to be available at `http://127.0.0.1:1234`
- Ensure your model server is running before using the app.

3. Run the Streamlit app:

```bash
streamlit run app.py
```

## Usage

1. Open the Streamlit app in your browser.
2. Enter your startup name and financial inputs:
   - Monthly Revenue
   - Monthly Burn Rate
   - Cash in Bank
   - Growth Rate (%)
   - Number of Employees
3. Ask a CFO question in the text box.
4. Click `Analyze`.
5. Review key metrics and the AI CFO response.

## Notes

- This UI uses the existing backend logic from `cfo_engine.py` and `llm_handler.py`.
- Do not modify backend files unless you want to change financial logic or prompt behavior.
- The app is built for demo and pitch purposes with a polished, startup-friendly layout.
