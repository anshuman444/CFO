import streamlit as st
import plotly.graph_objects as go
from streamlit_option_menu import option_menu
import uuid
import os

from cfo_engine import calculate_metrics
from llm_handler import ask_llm, get_system_message
from history_manager import save_chat, load_chat, clear_chat

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="LumenXo CFO | Private Strategic Advisory",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- PREMIUM DASHBOARD STYLING ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
    
    :root {
        --primary-accent: #10B981;
        --primary-glow: rgba(16, 185, 129, 0.3);
        --bg-midnight: #0B1326;
        --card-bg: rgba(30, 41, 59, 0.4);
        --card-border: rgba(255, 255, 255, 0.1);
        --text-muted: #94A3B8;
        --text-main: #F8FAFC;
        --font-display: 'Manrope', sans-serif;
        --font-body: 'Inter', sans-serif;
    }

    .stApp { 
        background-color: var(--bg-midnight); 
        background-image: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        background-attachment: fixed;
    }

    [data-testid="stSidebar"] {
        background-color: rgba(6, 14, 32, 0.8);
        border-right: 1px solid var(--card-border);
        backdrop-filter: blur(20px);
    }

    /* GLASS CARD SYSTEM */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 40px;
    }

    .premium-card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 16px;
        padding: 28px;
        backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 160px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .premium-card:hover { 
        border-color: var(--primary-accent); 
        transform: translateY(-5px);
        box-shadow: 0 0 20px var(--primary-glow);
    }

    .card-label { 
        color: var(--text-muted); 
        font-family: var(--font-display); 
        font-weight: 700; 
        font-size: 0.7rem; 
        text-transform: uppercase; 
        letter-spacing: 0.15em;
        margin-bottom: 8px;
    }
    .card-value { 
        color: var(--text-main); 
        font-family: var(--font-display); 
        font-weight: 800; 
        font-size: 2.2rem; 
        letter-spacing: -0.02em;
    }
    .card-status {
        margin-top: 12px;
        font-family: var(--font-body);
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .status-dot {
        height: 6px;
        width: 6px;
        background-color: var(--primary-accent);
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 8px var(--primary-accent);
    }

    .brand-container { padding: 20px 0; margin-bottom: 30px; }
    .brand-text { color: var(--text-main); font-family: var(--font-display); font-weight: 800; font-size: 2.8rem; letter-spacing: -0.05em; }
    .brand-accent { color: var(--primary-accent); text-shadow: 0 0 15px var(--primary-glow); }
    
    .section-title { 
        color: var(--text-main); 
        font-family: var(--font-display); 
        font-weight: 700; 
        font-size: 1.5rem; 
        margin-bottom: 25px; 
        padding-left: 10px;
        border-left: 4px solid var(--primary-accent);
    }

    /* CUSTOM BUTTONS */
    .stButton>button {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        border: none;
        padding: 0.6rem 1.5rem;
        border-radius: 8px;
        font-weight: 700;
        font-family: var(--font-display);
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: scale(1.02);
        box-shadow: 0 0 20px var(--primary-glow);
    }

    .block-container { padding-top: 3rem !important; }
</style>
""", unsafe_allow_html=True)

# --- SESSION INITIALIZATION ---
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "messages" not in st.session_state:
    persisted = load_chat(st.session_state.session_id)
    if persisted:
        st.session_state.messages = persisted["messages"]
        st.session_state.startup_data = persisted["startup_data"]
    else:
        st.session_state.messages = []
        st.session_state.startup_data = {
            "name": "Nimbus Labs",
            "revenue": 120000.0,
            "burn": 85000.0,
            "cash": 320000.0,
            "growth": 12.0,
            "headcount": 24,
            "ltv": 1200.0,
            "cac": 350.0,
            "new_revenue_pm": 15000.0,
            "growth_rate": 12.0,
            "employees": 24
        }

# --- SIDEBAR: INVESTOR INPUTS ---
with st.sidebar:
    st.markdown('<div class="brand-container"><span class="brand-text">LumenXo<span class="brand-accent">.</span></span></div>', unsafe_allow_html=True)
    st.caption("Strategic Intelligence Hub V2.0")
    st.markdown("---")
    
    with st.expander("🏢 Core Financials", expanded=True):
        s_name = st.text_input("Venture Name", value=st.session_state.startup_data["name"])
        s_rev = st.number_input("Monthly Revenue ($)", value=st.session_state.startup_data["revenue"], step=1000.0)
        s_burn = st.number_input("Monthly Burn ($)", value=st.session_state.startup_data["burn"], step=1000.0)
        s_cash = st.number_input("Cash Reserve ($)", value=st.session_state.startup_data["cash"], step=5000.0)
    
    with st.expander("📈 Investor Metrics", expanded=True):
        s_ltv = st.number_input("Customer LTV ($)", value=st.session_state.startup_data.get("ltv", 1200.0), step=50.0)
        s_cac = st.number_input("CAC ($)", value=st.session_state.startup_data.get("cac", 350.0), step=10.0)
        s_new_rev = st.number_input("New Revenue/mo ($)", value=st.session_state.startup_data.get("new_revenue_pm", 15000.0), step=500.0)

    st.session_state.startup_data.update({
        "name": s_name, "revenue_per_month": s_rev, "burn_rate": s_burn, "cash_in_bank": s_cash,
        "revenue": s_rev, "burn": s_burn, "cash": s_cash,
        "ltv": s_ltv, "cac": s_cac, "new_revenue_pm": s_new_rev,
        "growth_rate": st.session_state.startup_data.get("growth_rate", 12.0),
        "employees": st.session_state.startup_data.get("employees", 24)
    })
    
    metrics = calculate_metrics(st.session_state.startup_data)
    
    if st.button("End Session", width="stretch"):
        clear_chat(st.session_state.session_id); st.session_state.messages = []; st.session_state.session_id = str(uuid.uuid4()); st.rerun()

# --- NAVIGATION ---
selected = option_menu(
    menu_title=None, options=["Executive Intelligence", "Advisory Console"],
    icons=["activity", "cpu-fill"], default_index=0, orientation="horizontal",
    styles={
        "container": {"background-color": "rgba(30, 41, 59, 0.4)", "padding": "0!important", "margin-bottom": "2rem", "border": "1px solid rgba(255, 255, 255, 0.1)", "border-radius": "12px", "backdrop-filter": "blur(20px)"},
        "icon": {"color": "#10B981", "font-size": "18px"},
        "nav-link": {"font-size": "14px", "text-align": "center", "color": "#94A3B8", "font-weight": "600", "font-family": "Manrope"},
        "nav-link-selected": {"background-color": "rgba(16, 185, 129, 0.15)", "color": "#10B981", "border-bottom": "3px solid #10B981", "border-radius": "0px"},
    }
)

# --- DASHBOARD VIEW ---
if selected == "Executive Intelligence":
    st.markdown(f'<div class="section-title">Institutional Intelligence: {s_name}</div>', unsafe_allow_html=True)
    
    # LEVEL 1: Financial Health
    st.markdown(f"""
    <div class="metric-grid">
        <div class="premium-card">
            <div class="card-label">Survival Runway</div>
            <div class="card-value">{metrics['runway']} Mo</div>
            <div class="card-status"><span class="status-dot"></span> Institutional Liquidity</div>
        </div>
        <div class="premium-card">
            <div class="card-label">Burn Multiple</div>
            <div class="card-value">{metrics['burn_multiple']}x</div>
            <div class="card-status"><span class="status-dot"></span> Efficiency Index</div>
        </div>
        <div class="premium-card">
            <div class="card-label">LTV : CAC</div>
            <div class="card-value">{metrics['ltv_cac']}x</div>
            <div class="card-status"><span class="status-dot"></span> Unit Economics</div>
        </div>
        <div class="premium-card">
            <div class="card-label">Magic Number</div>
            <div class="card-value">{metrics['magic_number']}</div>
            <div class="card-status"><span class="status-dot"></span> Growth Velocity</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # LEVEL 2: Visual Intelligence
    vis_col1, vis_col2 = st.columns([1.5, 1], gap="large")
    
    with vis_col1:
        st.markdown('<div class="section-title">Cash Depletion Waterfall (24 Mo)</div>', unsafe_allow_html=True)
        # Create Waterfall Projection
        months = [f"M{i}" for i in range(1, 25)]
        cash_levels = []
        current_cash = s_cash
        for i in range(24):
            current_cash = max(0, current_cash - (s_burn - s_rev))
            cash_levels.append(current_cash)
            
        fig_waterfall = go.Figure(go.Scatter(
            x=months, y=cash_levels, fill='tozeroy',
            line=dict(color='#10B981', width=4),
            fillcolor='rgba(16, 185, 129, 0.15)'
        ))
        fig_waterfall.update_layout(
            paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            font_color='#94A3B8', height=350, margin=dict(l=0, r=0, t=10, b=0),
            xaxis=dict(showgrid=False), yaxis=dict(showgrid=True, gridcolor='#1E293B')
        )
        st.plotly_chart(fig_waterfall, width="stretch", config={'displayModeBar': False})
        
    with vis_col2:
        st.markdown('<div class="section-title">Survival Probability</div>', unsafe_allow_html=True)
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number", value = metrics['runway'],
            number = {'font': {'color': '#F8FAFC', 'family': 'Manrope', 'size': 48}, 'suffix': ' Mo'},
            gauge = {
                'axis': {'range': [None, 36], 'tickcolor': "#475569"},
                'bar': {'color': "#10B981"},
                'bgcolor': "rgba(30, 41, 59, 0.2)",
                'steps' : [{'range': [0, 6], 'color': "rgba(244, 63, 94, 0.2)"},
                          {'range': [6, 12], 'color': "rgba(245, 158, 11, 0.2)"},
                          {'range': [12, 36], 'color': "rgba(16, 185, 129, 0.2)"}]
            }
        ))
        fig_gauge.update_layout(paper_bgcolor='rgba(0,0,0,0)', height=350, margin=dict(l=20, r=20, t=50, b=20))
        st.plotly_chart(fig_gauge, width="stretch", config={'displayModeBar': False})

# --- CHAT VIEW ---
elif selected == "Advisory Console":
    st.markdown(f'<div class="section-title">LumenXo Strategy Terminal: {s_name}</div>', unsafe_allow_html=True)
    chat_container = st.container()
    with chat_container:
        for message in st.session_state.messages:
            with st.chat_message(message["role"]): st.markdown(message["content"])

    if prompt := st.chat_input("Input strategic query..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"): st.markdown(prompt)
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            message_placeholder.markdown("⚡ *Generating strategic insight...*")
            history = [{"role": "system", "content": get_system_message(st.session_state.startup_data, metrics)}] + st.session_state.messages
            response = ask_llm(history)
            message_placeholder.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})
        save_chat(st.session_state.session_id, st.session_state.messages, st.session_state.startup_data)

st.markdown("---")
st.caption("Custom Private Terminal by LumenXo | Operational Financial Intelligence.")
