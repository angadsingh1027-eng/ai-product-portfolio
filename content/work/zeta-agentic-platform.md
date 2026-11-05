## Context
Zeta is a banking technology company. This work was done for banking and fintech enterprises, deployed on AWS and Azure and serving 150K+ customers.

## Users and pain points
- **Enterprise issuer (B2B):** needed to scale card distribution (about 40K a month) without proportional headcount, and lacked real-time resolution visibility.
- **Cardholders (B2C, 150K+):** about 20% were non-app users who called out of a need for trust, not because of friction. 95% of payments happened in the app, yet 5% still called for reassurance, so the voice AI had to be trusted, not just functional.
- **Agents:** routine queries (payments, balances) consumed capacity that complex escalations needed.

## Solution
A 0-to-1 agentic contact-center platform with AI automation and human-expert escalation across voice and chat.
- **Three tiers:** RAG self-serve for FAQs, agentic flows for transactional intents, human escalation through workflow automation.
- **Voice agent:** real-time NLU voice bot handling payments, balances, disputes and card block with sub-second latency (Amazon Connect, Azure ASR, RASA/GPT-4o, Deepgram TTS).
- **Hybrid NLU + LLM design:** deterministic flows, GPT-4o command generation, and an LLM rephraser.
- **RAG knowledge base:** 150+ FAQ and SOP entries on Azure AI Search, with answer correctness and retrieval accuracy tracked.

## What I owned
- **Roadmap:** vision, non-functional requirements (latency under 1s, 93%+ command accuracy) and phased releases, aligned across business and engineering.
- **Prioritization:** LLM clustering of 100K+ call transcripts into 69 contact reasons to size volume and rank automation ROI.
- **Evaluation and fine-tuning:** GPT-4o vs Claude benchmark, GPT-4o fine-tuning, a custom evaluation framework adopted across the platform, and about 20% of evaluations automated with LLM-as-a-judge.
- **Component-level evals:** ASR (WER, latency under 400ms) and NLU classifiers (95% on GPT-generated data, 83% on real transcripts, +2% with human-in-the-loop).
- **Conversational flow design:** hybrid flows with hallucination guardrails, escalation triggers and multi-intent fallback.
- **User research:** support-journey interviews paired with transcript analysis; surfaced trust gaps, accent robustness and multi-intent calls, saving about 6 weeks of development effort.
- **Vendor evaluation:** benchmarked 10+ CCaaS providers into a framework used internally for platform selection.
