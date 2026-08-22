def get_startup_input():
    name = input("Enter startup name: ")
    revenue = float(input("Monthly revenue: "))
    burn = float(input("Monthly burn rate: "))
    cash = float(input("Cash in bank: "))
    growth = float(input("Growth rate (%): "))
    employees = int(input("Number of employees: "))

    return {
        "name": name,
        "revenue_per_month": revenue,
        "burn_rate": burn,
        "cash_in_bank": cash,
        "growth_rate": growth,
        "employees": employees
    }

def calculate_metrics(startup):
    revenue = startup.get("revenue_per_month", 0)
    burn = startup.get("burn_rate", 0)
    cash = startup.get("cash_in_bank", 0)
    
    # Strategic Investor Metrics (LTV/CAC)
    ltv = startup.get("ltv", 1200.0)
    cac = startup.get("cac", 350.0)
    new_rev = startup.get("new_revenue_pm", 15000.0) 

    runway = cash / burn if burn > 0 else 99
    
    # Institutional Risk Logic
    if runway < 6:
        risk = "CRITICAL"
    elif runway < 12:
        risk = "MODERATE"
    else:
        risk = "STABLE"

    if burn > revenue:
        status = "LOSS PHASE"
    else:
        status = "PROFITABLE"

    # Unit Economics & Efficiency
    ltv_cac_ratio = ltv / cac if cac > 0 else 0
    burn_multiple = burn / new_rev if new_rev > 0 else 0
    magic_number = (new_rev * 12) / (burn * 12 * 0.4) if burn > 0 else 0
    profit_margin = revenue - burn

    return {
        "runway": round(runway, 1),
        "risk": risk,
        "status": status,
        "profit_margin": profit_margin,
        "margin_status": "SURPLUS" if profit_margin > 0 else "DEFICIT",
        "ltv_cac": round(ltv_cac_ratio, 1),
        "burn_multiple": round(burn_multiple, 2),
        "magic_number": round(magic_number, 2)
    }
