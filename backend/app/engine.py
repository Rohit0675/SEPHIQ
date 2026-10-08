from .store import fictional_features, fictional_pricing, fictional_feedback, fictional_summary, competitor_signals, profiles
from .schemas import AnalyzeRequest

NEXORA = "Nexora"


def source_for_signal(item):
    return {"title": item["title"], "company": item["product"], "published_date": item["date"], "url": item["source"], "source_id": item["id"], "source_type": "Official monitored source"}


def category_features(category):
    feats = fictional_features()
    if not category or category.lower() == "all": return feats
    c = category.lower()
    return [x for x in feats if c in x["Category"].lower() or x["Category"].lower() in c]


def build_evidence(companies, date_from, date_to, category):
    evidence = {c: {"features": [], "pricing": [], "feedback": [], "signals": [], "profile": profiles().get(c)} for c in companies}
    if NEXORA in companies:
        evidence[NEXORA]["features"] = category_features(category)
        evidence[NEXORA]["pricing"] = fictional_pricing()
        evidence[NEXORA]["feedback"] = fictional_feedback()
    for s in competitor_signals([c for c in companies if c != NEXORA], date_from, date_to, category):
        evidence[s["product"]]["signals"].append(s)
    return evidence


def detect_intent(question):
    q = question.lower()
    if any(k in q for k in ["price", "pricing", "cost", "plan", "subscription"]): return "pricing"
    if any(k in q for k in ["recommend", "recommendation", "should ", "priority", "prioritize", "strategy", "strategic"]): return "strategy"
    if any(k in q for k in ["latest", "recent", "update", "release", "new ", "recently"]): return "recent"
    if any(k in q for k in ["ai", "agent", "artificial intelligence"]): return "ai"
    if any(k in q for k in ["collaboration", "teamwork", "co-edit", "collaborate"]): return "collaboration"
    if any(k in q for k in ["feature", "capability", "function"]): return "capability"
    if any(k in q for k in ["strongest", "leader", "best", "ahead", "winner", "advantage"]): return "positioning"
    return "comparison"


def compare_features(companies, evidence):
    rows=[]
    if NEXORA not in companies: return rows
    for f in evidence[NEXORA]["features"]:
        basis=f.get("Modeled On / Basis", "").lower()
        row={"feature":f["Feature"], NEXORA:True, "category":f.get("Category"), "status":f.get("Similarity Status")}
        for c in companies:
            if c==NEXORA: continue
            row[c] = c.lower() in basis
        rows.append(row)
    return rows


def scorecard(companies, evidence):
    dimensions=[
        ("AI & agents", lambda c: any(k in " ".join(profiles().get(c,{}).get("capabilities",[])).lower() for k in ["ai","agent"])),
        ("Collaboration", lambda c: any(k in " ".join(profiles().get(c,{}).get("capabilities",[])).lower() for k in ["collaboration","co-editing","real-time"])),
        ("Workflow breadth", lambda c: len(profiles().get(c,{}).get("capabilities",[])) >= 10),
        ("Design depth", lambda c: any(k in " ".join(profiles().get(c,{}).get("capabilities",[])).lower() for k in ["design","motion","visual"])),
        ("Automation / integrations", lambda c: any(k in " ".join(profiles().get(c,{}).get("capabilities",[])).lower() for k in ["integration","mcp","automation","workers","calendar"])),
    ]
    out=[]
    for name,fn in dimensions:
        row={"dimension":name}
        for c in companies: row[c] = bool(fn(c))
        out.append(row)
    return out


def metrics(companies,evidence):
    external=sum(len(evidence[c]["signals"]) for c in companies if c!=NEXORA)
    unique=sum(1 for f in evidence.get(NEXORA,{}).get("features",[]) if f.get("Similarity Status","").lower()=="different")
    avg=None
    if NEXORA in companies:
        fb=fictional_feedback(); avg=round(sum(float(x["Rating (1-5)"]) for x in fb)/len(fb),1)
    return {"signals":external,"unique_capabilities":unique,"features_available":len(evidence.get(NEXORA,{}).get("features",[])),"avg_customer_rating":avg,"companies_compared":len(companies)}


def relevant_signals(company, signals, intent):
    if intent=="ai": return [s for s in signals if s.get("category")=="AI"]
    if intent=="collaboration": return [s for s in signals if s.get("category")=="Collaboration"]
    if intent=="recent": return signals[:5]
    return signals
def make_article_answer(req, evidence, intent):
    article = req.article_context

    if not article:
        return None

    title = article.title
    summary = article.summary or "No article summary was provided."
    publisher = article.publisher or "External publisher"
    company = article.company or "AI Industry"
    date = article.date or "undated"

    # ---------------------------------------------------------
    # Identify the competitor involved in the article.
    # ---------------------------------------------------------

    competitor = company

    if competitor not in req.companies:
        competitor_lower = competitor.lower()

        for c in req.companies:
            if c.lower() in competitor_lower:
                competitor = c
                break

    # ---------------------------------------------------------
    # Article-specific strategic interpretation.
    # ---------------------------------------------------------

    implications = []

    if competitor == "Figma":
        implications.append(
            "The development increases pressure on Nexora to "
            "integrate AI directly into design and product "
            "workflows rather than treating AI as a standalone "
            "content-generation feature."
        )

        implications.append(
            "Figma's movement is particularly relevant to "
            "Nexora's voice-to-design and collaboration "
            "differentiators because the competitive boundary "
            "is shifting from design software toward "
            "AI-assisted workflow execution."
        )

    elif competitor == "Canva":
        implications.append(
            "The development strengthens Canva's position "
            "around broad visual creation and lowers the "
            "friction between ideation, generation and "
            "content production."
        )

        implications.append(
            "For Nexora, the implication is to avoid competing "
            "only on template or generation breadth and instead "
            "connect AI creation with its differentiated "
            "cross-team workflow capabilities."
        )

    elif competitor == "Notion":
        implications.append(
            "The development reinforces Notion's shift from a "
            "documentation workspace toward an agentic "
            "knowledge and workflow platform."
        )

        implications.append(
            "For Nexora, this increases the strategic importance "
            "of connecting its AI capabilities with project "
            "execution, collaboration and organizational context."
        )

    elif competitor == "Google":
        implications.append(
            "The development indicates that AI agents are "
            "increasingly being embedded directly into "
            "mainstream productivity applications rather "
            "than operating as separate chat interfaces."
        )

        implications.append(
            "For Nexora, the competitive risk is that large "
            "platform ecosystems can distribute agentic "
            "capabilities across existing enterprise workflows."
        )

    elif competitor == "Microsoft":
        implications.append(
            "The development reinforces the convergence of "
            "AI assistants, enterprise applications and "
            "workflow automation."
        )

        implications.append(
            "Nexora should therefore prioritize interoperability "
            "and workflow integration rather than building an "
            "isolated AI assistant."
        )

    elif competitor == "OpenAI":
        implications.append(
            "The development suggests that the competitive "
            "frontier is moving toward systems capable of "
            "executing multi-step work rather than simply "
            "generating content."
        )

        implications.append(
            "For Nexora, this increases the value of its "
            "workflow, project-management and cross-functional "
            "context as potential foundations for agentic execution."
        )

    else:
        implications.append(
            f"The development from {competitor} is relevant "
            "because it indicates continued movement toward "
            "AI embedded inside existing application workflows."
        )

        implications.append(
            "For Nexora, the strategic response should focus "
            "on whether this capability threatens a current "
            "differentiator, changes customer expectations, "
            "or creates an integration opportunity."
        )

    # ---------------------------------------------------------
    # Extract the relevant monitored signal history.
    # ---------------------------------------------------------

    competitor_signals = []

    if competitor in evidence:
        competitor_signals = evidence[competitor].get(
            "signals",
            [],
        )

    recent_signal_text = ""

    if competitor_signals:
        recent_signal_text = (
            f" SEPHIQ's monitored history also contains "
            f"{len(competitor_signals)} signal(s) for "
            f"{competitor} in the selected evidence window."
        )

    # ---------------------------------------------------------
    # Build the article-specific answer.
    # ---------------------------------------------------------

    return (
        f"This analysis is anchored to the selected development: "
        f"'{title}' published by {publisher} on {date}. "
        f"The article concerns {competitor}. "
        f"{summary} "
        f"{' '.join(implications)}"
        f"{recent_signal_text} "
        f"The key strategic question for Nexora is whether this "
        f"development should trigger a product response, an "
        f"acceleration of an existing capability, or simply "
        f"continued monitoring."
    )

def make_direct_answer(req,evidence,intent):
    article_answer = make_article_answer(
        req,
        evidence,
        intent,
    )

    if article_answer:
        return article_answer
    
    companies=req.companies
    names=", ".join(companies)
    sigs={c:relevant_signals(c,evidence[c]["signals"],intent) for c in companies if c!=NEXORA}
    if intent=="pricing" and NEXORA in companies:
        plans=evidence[NEXORA]["pricing"]
        prices=[p["Price (INR/month)"] for p in plans if isinstance(p.get("Price (INR/month)"),(int,float))]
        return f"For pricing, Nexora has {len(plans)} documented plans in its internal benchmark, ranging from INR {min(prices):,.0f} to INR {max(prices):,.0f} per month where a numeric price is specified. The supplied competitor evidence does not contain a comparable normalized Figma/Canva/Notion price table, so SEPHIQ treats competitor pricing as an evidence gap rather than guessing."
    if intent=="ai":
        parts=[]
        for c in companies:
            if c==NEXORA: parts.append("Nexora has AI content generation in its benchmark plus voice-to-design as a differentiated capability.")
            else: parts.append(f"{c} has {len(sigs.get(c,[]))} monitored AI-related signal(s) in the selected window.")
        return " ".join(parts)+" The strongest current external AI momentum in the supplied evidence is concentrated in agentic creation, reusable AI workflows and AI embedded directly in existing work contexts."
    if intent=="positioning":
        ranked=sorted([(c,len(evidence[c]["signals"])) for c in companies if c!=NEXORA],key=lambda x:x[1],reverse=True)
        lead=ranked[0][0] if ranked else companies[0]
        return f"On the supplied evidence, {lead} has the highest volume of recent monitored signals in the selected scope. That is a signal-activity lead, not proof of overall product superiority. The strategic distinction is more useful: Figma is strongest in design-to-build workflows, Canva in broad visual communication and AI-assisted creation, and Notion in knowledge/workflow automation; Nexora's benchmark position is breadth across these patterns plus five differentiated capabilities."
    if intent=="strategy":
        return f"For {NEXORA if NEXORA in companies else 'the compared portfolio'}, the strategic opportunity is to avoid competing on every surface equally. The evidence points toward differentiating around cross-functional workflow consolidation, while using the strongest observed competitor capabilities as reference points. For the current comparison ({names}), the clearest strategic lens is where breadth, AI workflow depth and defensible differentiation intersect."
    if intent=="recent":
        total=sum(len(v) for v in sigs.values())
        return f"SEPHIQ found {total} recent monitored signal(s) for {names} in the selected evidence window. The pattern is not simply 'more features': competitors are increasingly embedding AI into the workflow itself—Figma around design agents and creative production, Canva around end-to-end visual creation, and Notion around agents, knowledge and automation."
    return f"SEPHIQ's comparison of {names} combines structured internal evidence for Nexora with official monitored product signals for the external companies. The useful conclusion is a capability-and-momentum view rather than a fabricated universal ranking: each competitor is advancing a different center of gravity while Nexora is positioned around cross-functional breadth and explicit differentiators."


def deterministic_analysis(req):
    evidence=build_evidence(req.companies,req.date_from,req.date_to,req.category)
    intent=detect_intent(req.question)
    findings=[]; sources=[]; themes=[]; differences=[]; limitations=[]; recommendations=[]
        # Add the selected live article as an evidence source
    if req.article_context:
        article = req.article_context

        article_source_id = (
            "NEWS-" + str(abs(hash(article.url or article.title)))[:10]
        )

        sources.append({
            "title": article.title,
            "company": article.company or "AI Industry",
            "published_date": article.date or "Unknown",
            "url": article.url,
            "source_id": article_source_id,
            "source_type": (
                f"Live news source · {article.publisher or 'External publisher'}"
            ),
        })

        findings.append({
            "company": article.company or "AI Industry",
            "finding": (
                f"Selected live intelligence article: "
                f"'{article.title}' published by "
                f"{article.publisher or 'external publisher'} "
                f"on {article.date or 'an unknown date'}."
            ),
            "source_ids": [article_source_id],
            "source_urls": [article.url] if article.url else [],
        })
    for c in req.companies:
        if c==NEXORA:
            feats=evidence[c]["features"]; unique=[f for f in feats if f.get("Similarity Status","").lower()=="different"]
            findings.append({"company":c,"finding":f"Nexora's internal benchmark contains {len(feats)} capability records in this scope, including {len(unique)} explicitly differentiated records. Its customer dataset contains {len(evidence[c]['feedback'])} synthetic feedback records.","source_ids":["FC-S001","FC-S003"],"source_urls":[]})
            sources.extend([
                {"title":"Nexora Product Specification","company":c,"published_date":"Internal","url":"internal://nexora/product-specification","source_id":"FC-S001","source_type":"Synthetic / internal benchmark"},
                {"title":"Nexora Pricing Specification","company":c,"published_date":"Internal","url":"internal://nexora/pricing-specification","source_id":"FC-S002","source_type":"Synthetic / internal benchmark"},
                {"title":"Nexora Customer Feedback Dataset","company":c,"published_date":"Internal","url":"internal://nexora/customer-feedback","source_id":"FC-S003","source_type":"Synthetic / internal benchmark"},
            ])
            differences.append("Nexora's five benchmark differentiators are voice-to-design generation, offline-first sync, cross-team sentiment analytics, regulatory compliance templates and a creator micro-licensing marketplace.")
        else:
            rs=relevant_signals(c,evidence[c]["signals"],intent)
            if rs:
                findings.append({"company":c,"finding":f"{c} has {len(rs)} relevant official monitored signal(s) in the selected scope. The most recent is '{rs[0]['title']}' on {rs[0]['date']}.","source_ids":[s['id'] for s in rs[:5]],"source_urls":[s['source'] for s in rs[:5]]})
                for s in rs: sources.append(source_for_signal(s))
            else:
                limitations.append(f"No monitored {intent} signal for {c} matched the selected filters. Missing history is not evidence of no activity.")
    if any(evidence[c]["signals"] for c in req.companies if c!=NEXORA):
        themes.append("AI is moving from isolated generation toward workflow-native agents, automation and context-aware creation.")
    if len(req.companies)>2: themes.append("The comparison separates company-specific evidence before drawing cross-company themes, reducing unsupported one-company-to-another claims.")
    if NEXORA in req.companies: recommendations=["Protect Nexora's five explicit differentiators as strategic moats rather than treating them as generic feature parity.","Prioritize workflow integration: competitors are increasingly connecting creation, knowledge, automation and publishing instead of shipping isolated AI tools.","Build the competitor evidence layer continuously so future comparisons can move from signal-based assessment toward measured feature, pricing and momentum scorecards."]
    else:
        recommendations=["Use each competitor's center of gravity as a benchmark: Figma for design-to-build depth, Canva for visual communication breadth, and Notion for knowledge/workflow automation.","Avoid interpreting signal volume as product quality; pair release momentum with capability depth and customer evidence when making investment decisions."]
        limitations.append("Competitor-to-competitor comparisons use structured official product profiles plus monitored releases, but are not a complete third-party feature audit.")
    m=metrics(req.companies,evidence)
    return {"answer":make_direct_answer(req,evidence,intent),"analysis_type":req.analysis_type,"companies":req.companies,"question":req.question,"key_findings":findings,"common_themes":themes,"differences":differences,"strategic_recommendations":recommendations,"comparison_scorecard":scorecard(req.companies,evidence),"competitor_profiles":[{"company":c,**profiles()[c]} for c in req.companies],"sources":sources,"limitations":limitations,"metrics":m,"evidence":evidence,"feature_matrix":compare_features(req.companies,evidence),"intent":intent}
