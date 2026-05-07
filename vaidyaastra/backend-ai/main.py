from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="VaidyaAstra AI Service")

class ReportRequest(BaseModel):
    report_text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to VaidyaAstra AI Microservice"}

@app.post("/api/ai/summarize-report")
def summarize_report(request: ReportRequest):
    # Integration with OpenAI / Gemini will go here
    return {
        "summary": "This is a mocked AI summary of the medical report.",
        "flags": ["High Blood Pressure", "Elevated Sugar Levels"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
