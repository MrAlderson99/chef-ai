from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chef_engine import inicializar_chef

app = FastAPI(title="Chef Gourmet API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Brain (RAG System)
# Ensure you have a 'recipes.pdf' in the backend directory
# or catch the error if it's missing for the demo.
try:
    chef_especialista = inicializar_chef("recipes.pdf")
    print("Chef Engine Loaded Successfully")
except Exception as e:
    print(f"Warning: Could not load PDF engine: {e}")
    chef_especialista = None

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"status": "Chef is in the kitchen"}

@app.post("/ask-chef")
async def ask_chef(request: QuestionRequest):
    if not chef_especialista:
        return {"response": "The Chef's recipe book (PDF) is missing."}
    
    response = chef_especialista.run(request.question)
    return {"response": response}
