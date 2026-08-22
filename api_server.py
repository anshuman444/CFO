from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn

# Import existing logic
from cfo_engine import calculate_metrics
from llm_handler import ask_llm, get_system_message
from history_manager import save_chat, load_chat, clear_chat

app = FastAPI(title="LumenXo CFO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartupData(BaseModel):
    name: str
    revenue: float
    burn: float = 0 # Legacy field
    cash: float
    cogs: Optional[float] = None
    opex: Optional[float] = None
    ltv: float = 1200.0
    cac: float = 350.0
    churn: float = 2.5
    new_revenue_pm: float = 15000.0
    growth_rate: float = 12.0
    employees: int = 24

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: str
    messages: List[ChatMessage]
    startup_data: StartupData

@app.post("/calculate")
async def calculate(data: StartupData):
    startup_dict = data.dict()
    # Map fields for engine
    startup_dict["revenue_per_month"] = data.revenue
    startup_dict["cash_in_bank"] = data.cash
    # If opex/cogs not provided, use legacy burn to estimate
    if data.opex is None:
        startup_dict["opex"] = data.burn * 0.8
    if data.cogs is None:
        startup_dict["cogs"] = data.burn * 0.2
        
    metrics = calculate_metrics(startup_dict)
    return {"metrics": metrics, "startup_data": startup_dict}

@app.post("/chat")
async def chat(request: ChatRequest):
    startup_dict = request.startup_data.dict()
    startup_dict["revenue_per_month"] = request.startup_data.revenue
    startup_dict["cash_in_bank"] = request.startup_data.cash
    
    metrics = calculate_metrics(startup_dict)
    system_content = get_system_message(startup_dict, metrics)
    full_messages = [{"role": "system", "content": system_content}]
    for msg in request.messages:
        full_messages.append({"role": msg.role, "content": msg.content})
    
    response = ask_llm(full_messages)
    messages_dicts = [{"role": m.role, "content": m.content} for m in request.messages]
    messages_dicts.append({"role": "assistant", "content": response})
    save_chat(request.session_id, messages_dicts, startup_dict)
    return {"response": response, "history": messages_dicts}

@app.get("/sessions")
async def list_sessions():
    """Returns all session IDs with metadata for sidebar display."""
    import json, os
    if not os.path.exists("chat_history.json"):
        return {"sessions": []}
    try:
        with open("chat_history.json", "r") as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {"sessions": []}
    
    sessions = []
    for sid, sdata in data.items():
        msgs = sdata.get("messages", [])
        user_msgs = [m for m in msgs if m.get("role") == "user"]
        title = user_msgs[0]["content"][:60] if user_msgs else "New Session"
        sessions.append({
            "id": sid,
            "title": title,
            "last_updated": sdata.get("last_updated", ""),
            "message_count": len(msgs),
        })
    # Sort by most recent first
    sessions.sort(key=lambda s: s.get("last_updated", ""), reverse=True)
    return {"sessions": sessions}

@app.get("/session/{session_id}")
async def get_session(session_id: str):
    persisted = load_chat(session_id)
    if persisted:
        return persisted
    return {"messages": [], "startup_data": None}

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    clear_chat(session_id)
    return {"status": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
