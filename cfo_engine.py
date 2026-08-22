def calculate_metrics(startup):
    # Core Inputs with safety defaults
    mrr = float(startup.get("revenue_per_month") or 0)
    arr = mrr * 12
    cogs = float(startup.get("cogs") or (mrr * 0.2))
    opex = float(startup.get("opex") or (startup.get("burn_rate", 0) * 0.8))
    cash = float(startup.get("cash_in_bank") or 0)
    
    # Derived Core
    ebitda = mrr - (cogs + opex)
    burn = cogs + opex
    
    # Growth & Efficiency
    ltv = float(startup.get("ltv") or 1200.0)
    cac = float(startup.get("cac") or 350.0)
    churn = float(startup.get("churn") or 2.5)
    new_rev = float(startup.get("new_revenue_pm") or 15000.0)
    growth_rate = float(startup.get("growth_rate") or 12.0)

    # Runway logic
    net_burn = burn - mrr
    if net_burn <= 0:
        runway = 99.0
    else:
        runway = cash / net_burn
    
    # Risk Profile
    if runway < 6:
        risk = "CRITICAL"
    elif runway < 12:
        risk = "MODERATE"
    else:
        risk = "STABLE"

    # Financial Status
    status = "EBITDA POSITIVE" if ebitda >= 0 else "EXPANSION PHASE (NET LOSS)"

    # Ratios
    ltv_cac_ratio = ltv / cac if cac > 0 else 0
    burn_multiple = burn / new_rev if new_rev > 0 else 0
    magic_number = new_rev / (burn * 0.4) if burn > 0 else 0
    
    # Projection for charts
    projection = []
    curr_cash = cash
    curr_rev = mrr
    for i in range(12):
        # Apply monthly growth
        curr_rev = curr_rev * (1 + (growth_rate / 100 / 12))
        curr_ebitda = curr_rev - burn
        curr_cash = max(0, curr_cash + curr_ebitda)
        
        projection.append({
            "month": f"M{i+1}",
            "cash": round(curr_cash, 2),
            "revenue": round(curr_rev, 2),
            "expenses": round(burn, 2)
        })

    return {
        "runway": round(runway, 1),
        "risk": risk,
        "status": status,
        "ebitda": round(ebitda, 2),
        "ltv_cac": round(ltv_cac_ratio, 2),
        "burn_multiple": round(burn_multiple, 2),
        "magic_number": round(magic_number, 2),
        "churn_rate": churn,
        "projection": projection,
        "arr": arr,
        "gross_margin": round(((mrr - cogs) / mrr) * 100, 1) if mrr > 0 else 0
    }
