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
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
        --primary-accent: #22C55E;
        --bg-midnight: #020617;
        --card-bg: #0B0E14;
        --border-subtle: #1E293B;
        --text-muted: #94A3B8;
        --text-main: #F8FAFC;
    }

    .stApp { background-color: var(--bg-midnight); background-image: none !important; }

    [data-testid="stSidebar"] {
        background-color: #020617;
        border-right: 1px solid var(--border-subtle);
    }

    /* CUSTOM METRIC CARDS */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }

    .premium-card {
        background: var(--card-bg);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
        transition: all 0.3s ease;
    }

    .premium-card:hover { border-color: var(--primary-accent); transform: translateY(-3px); }

    .card-label { color: var(--text-muted); font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .card-value { color: var(--text-main); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 1.8rem; }
    .card-delta { font-size: 0.85rem; font-weight: 500; margin-top: 4px; }
    .delta-pos { color: #22C55E; }
    .delta-neg { color: #F43F5E; }

    .brand-container { padding: 10px 0; margin-bottom: 20px; }
    .brand-text { color: var(--text-main); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 2.4rem; letter-spacing: -0.04em; }
    .brand-accent { color: var(--primary-accent); }
    .section-title { color: var(--text-main); font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1.25rem; margin-bottom: 20px; margin-top: 10px; }

    .block-container { padding-top: 2rem !important; }
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
        "container": {"background-color": "transparent", "padding": "0!important", "margin-bottom": "1.5rem"},
        "icon": {"color": "#22C55E", "font-size": "18px"},
        "nav-link": {"font-size": "14px", "text-align": "center", "color": "#94A3B8", "font-weight": "600", "font-family": "Manrope"},
        "nav-link-selected": {"background-color": "rgba(34, 197, 94, 0.1)", "color": "#22C55E", "border-bottom": "2px solid #22C55E", "border-radius": "0px"},
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
            <div class="card-value">{metrics['runway']} mo</div>
            <div class="card-delta">Net Liquidity Time</div>
        </div>
        <div class="premium-card">
            <div class="card-label">Burn Multiple</div>
            <div class="card-value">{metrics['burn_multiple']}x</div>
            <div class="card-delta delta-neg">Efficiency Index</div>
        </div>
        <div class="premium-card">
            <div class="card-label">LTV : CAC</div>
            <div class="card-value">{metrics['ltv_cac']}x</div>
            <div class="card-delta delta-pos">Unit Economics</div>
        </div>
        <div class="premium-card">
            <div class="card-label">Magic Number</div>
            <div class="card-value">{metrics['magic_number']}</div>
            <div class="card-delta delta-pos">Growth Velocity</div>
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
            line=dict(color='#22C55E', width=3),
            fillcolor='rgba(34, 197, 94, 0.1)'
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
            number = {'font': {'color': '#FFFFFF', 'size': 40}, 'suffix': ' mo'},
            gauge = {
                'axis': {'range': [None, 36], 'tickcolor': "#475569"},
                'bar': {'color': "#22C55E"},
                'bgcolor': "#0B0E14",
                'steps' : [{'range': [0, 6], 'color': "rgba(244, 63, 94, 0.3)"},
                          {'range': [6, 12], 'color': "rgba(245, 158, 11, 0.3)"},
                          {'range': [12, 36], 'color': "rgba(34, 197, 94, 0.3)"}]
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
