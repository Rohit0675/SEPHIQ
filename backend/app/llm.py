import json, os, urllib.request
OLLAMA_URL=os.getenv("OLLAMA_URL","http://localhost:11434/api/generate")
OLLAMA_MODEL=os.getenv("OLLAMA_MODEL","llama3.2:3b")

def enrich(base):
    if os.getenv("SEPHIQ_USE_OLLAMA","false").lower()!="true": return base
    prompt=f'''You are SEPHIQ, an executive competitive-intelligence analyst. Answer the user's exact question using ONLY the supplied evidence. Do not invent facts. Preserve uncertainty where evidence is missing. Return one polished paragraph of 90-140 words. User question: {base["question"]}\n\nEvidence JSON:\n{json.dumps({k:base[k] for k in ["companies","key_findings","common_themes","differences","strategic_recommendations","limitations"]},ensure_ascii=False)}'''
    payload=json.dumps({"model":OLLAMA_MODEL,"prompt":prompt,"stream":False}).encode()
    try:
        req=urllib.request.Request(OLLAMA_URL,data=payload,headers={"Content-Type":"application/json"})
        with urllib.request.urlopen(req,timeout=12) as resp: data=json.loads(resp.read().decode())
        text=data.get("response","").strip()
        if text: base["answer"]=text; base["llm_used"]=True
    except Exception: base["llm_used"]=False
    return base
