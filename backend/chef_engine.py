import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# In a real environment, set this via `export OPENAI_API_KEY=...`
# os.environ["OPENAI_API_KEY"] = "your_key_here"

def inicializar_chef(caminho_pdf):
    if not os.path.exists(caminho_pdf):
        raise FileNotFoundError(f"PDF not found at {caminho_pdf}")

    # 1. Load Knowledge
    loader = PyPDFLoader(caminho_pdf)
    paginas = loader.load_and_split()

    # 2. Create Vector Store
    vectorstore = Chroma.from_documents(
        documents=paginas, 
        embedding=OpenAIEmbeddings()
    )

    # 3. Configure LLM
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0.2)

    # 4. Create Retrieval Chain
    chef_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    
    return chef_chain
