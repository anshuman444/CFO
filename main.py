from cfo_engine import get_startup_input, calculate_metrics
from llm_handler import build_prompt, ask_llm


def run():
    print("=== AI CFO System ===\n")

    # Step 1: Get startup data
    startup = get_startup_input()

    # Step 2: Calculate financial metrics
    metrics = calculate_metrics(startup)

    # Step 3: Ask user question
    question = input("\nAsk your CFO question: ")

    # Step 4: Build prompt
    prompt = build_prompt(startup, metrics, question)

    # Step 5: Get LLM response
    response = ask_llm(prompt)

    # Step 6: Output
    print("\n=== AI CFO Response ===\n")
    print(response)


if __name__ == "__main__":
    run()