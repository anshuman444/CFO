import requests

def get_system_message(startup, metrics):
    """Returns the core CFO system message with current financial context."""
    return f"""
You are a startup CFO. You are professional, analytical, and direct.
Your goal is to help the founder understand their financials and make better decisions.

### Current Financial Snapshot ({startup.get('name', 'Startup')})
- Revenue: ${startup.get('revenue_per_month', 0):,.2f} / mo
- Burn Rate: ${startup.get('burn_rate', 0):,.2f} / mo
- Cash on Hand: ${startup.get('cash_in_bank', 0):,.2f}
- Growth Rate: {startup.get('growth_rate', 0)}%
- Employees: {startup.get('employees', 0)}
- Runway: {metrics.get('runway', 0)} months
- Risk Level: {metrics.get('risk', 'N/A')}
- Overall Status: {metrics.get('status', 'N/A')}
- Profit Margin: ${metrics.get('profit_margin', 0):,.2f} ({metrics.get('margin_status', 'N/A')})

### Instructions
1. Answer like a real CFO: Be direct, data-driven, and practical.
2. Avoid jargon where unnecessary.
3. If you don't know the answer, say "I don't know" - do not hallucinate.
4. If a question is unrelated to the financial data or CFO tasks, politely decline.
5. You can ask clarifying questions if needed to provide a better answer.
6. Keep follow-up questions short and focused.
7. Maintain awareness of the conversation history provided.
"""

def ask_llm(messages):
    """Sends a list of messages to the local LLM and returns the response with a mock fallback."""
    # Ensure no empty messages are sent
    filtered_messages = [m for m in messages if m.get("content") and m["content"].strip()]
    
    try:
        response = requests.post(
            "http://127.0.0.1:1236/v1/chat/completions",
            json={
                "model": "llama-3.2-3b-instruct", 
                "messages": filtered_messages,
                "temperature": 0.3,
                "stream": False
            },
            timeout=120
        )
        
        if response.status_code != 200:
            error_msg = response.text
            return f"LLM Server Error ({response.status_code}): {error_msg}. \n\n**Tip:** Ensure the 'Model Name' in the sidebar matches the model loaded in your server."
            
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Connection Error: {str(e)}. Ensure your local server is running on port 1235 and 'v1/chat/completions' is enabled."

def build_prompt(startup, metrics, user_question):
    """Legacy wrapper for single-prompt calls."""
    system = get_system_message(startup, metrics)
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user_question}
    ]
    return messages # Now returns a list of messages
