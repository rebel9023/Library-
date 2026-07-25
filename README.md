# GyanAI — Digital Library Intelligence Platform
### Gyanoday Bhavan | Parul University

GyanAI is an enterprise-grade AI-powered Digital Library Intelligence Platform engineered for Gyanoday Bhavan at Parul University. It serves 63,000+ students and faculty members by providing RAG-driven instant answers across Google Site pages, PDFs, research papers (IEEE, SCOPUS), question paper archives, NPTEL videos, and DSpace institutional repositories.

---

## Key Features

- **Floating Chatbot Widget**: Embedded on the bottom-right corner of the Gyanoday Bhavan Google Site homepage.
- **RAG & Guardrail Pipeline**: Zero-hallucination policy with hybrid vector search (Qdrant) and PostgreSQL keyword matching.
- **Automated Web Scraper**: Crawls Gyanoday Bhavan subpages every 6 hours, extracting text, PDFs, YouTube links, and syllabus updates.
- **12 Specialized AI Tools**: `searchWebsite`, `searchPDF`, `searchResearch`, `searchBooks`, `searchVideos`, `searchRepository`, `searchQuestionPapers`, `searchNotices`, `checkResourceStatus`, `getLibraryTiming`, `getContactInformation`, `recommendResources`.
- **Short & Long-Term Memory**: Session context history plus user department/degree memory (e.g. B.Tech vs Pharmacy tailored recommendations).
- **Admin Intelligence Dashboard**: Telemetry on popular searches, response speeds, RAG accuracy, failure rates, live knowledge base manager, and scraper status.
- **Google Sites Integration**: 1-line script embed support for Google Sites.

---

## Quick Start (Docker Deployment)

```bash
# 1. Clone repository
git clone https://github.com/paruluniversity/gyanai.git
cd gyanai

# 2. Build and start containers
docker-compose up -d --build

# 3. Pull Qwen 3 (8B) model inside Ollama container
docker exec -it gyanai-ollama ollama pull qwen:3-8b

# 4. Trigger initial knowledge base crawl
curl -X POST http://localhost:5000/api/scraper/trigger
```

---

## Port Allocation

| Service | Host Port | Container Port | URL |
|---|---|---|---|
| Nginx Reverse Proxy | 80 / 443 | 80 / 443 | `http://localhost` |
| Frontend Web SPA | 3000 | 80 | `http://localhost:3000` |
| Express API Backend | 5000 | 5000 | `http://localhost:5000` |
| Qdrant Vector DB | 6333 | 6333 | `http://localhost:6333` |
| PostgreSQL DB | 5432 | 5432 | `localhost:5432` |
| Redis Cache | 6379 | 6379 | `localhost:6379` |
| Ollama LLM Engine | 11434 | 11434 | `http://localhost:11434` |
| Prometheus | 9090 | 9090 | `http://localhost:9090` |
| Grafana | 3001 | 3000 | `http://localhost:3001` |

---

## Google Sites Embedding Instructions

Copy and paste this snippet into your **Google Site → Insert → Embed → Embed Code**:

```html
<iframe 
  src="https://gyanai.paruluniversity.ac.in" 
  style="position: fixed; bottom: 0; right: 0; width: 450px; height: 650px; border: none; z-index: 999999;"
  allow="microphone"
  title="GyanAI Digital Library Assistant">
</iframe>
```
