import json
import os
from datetime import datetime

HISTORY_FILE = "chat_history.json"

def save_chat(session_id, messages, startup_data):
    """Saves chat history and startup context to a local file."""
    data = {}
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}

    data[session_id] = {
        "last_updated": datetime.now().isoformat(),
        "startup_data": startup_data,
        "messages": messages
    }

    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)

def load_chat(session_id):
    """Loads chat history for a given session ID."""
    if not os.path.exists(HISTORY_FILE):
        return None

    with open(HISTORY_FILE, "r") as f:
        try:
            data = json.load(f)
            return data.get(session_id)
        except json.JSONDecodeError:
            return None

def clear_chat(session_id):
    """Removes a specific chat session."""
    if not os.path.exists(HISTORY_FILE):
        return

    with open(HISTORY_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = {}

    if session_id in data:
        del data[session_id]

    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)
